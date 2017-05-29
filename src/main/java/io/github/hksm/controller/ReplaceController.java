package io.github.hksm.controller;

import com.mysema.commons.lang.Pair;
import com.querydsl.core.types.Predicate;
import io.github.hksm.business.FoodBusiness;
import io.github.hksm.constant.AlergenicInfo;
import io.github.hksm.entity.*;
import io.github.hksm.repository.FoodRepository;
import io.github.hksm.repository.ProfileRepository;
import io.github.hksm.util.AuthUtils;
import io.github.hksm.util.Tuple3;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

/**
 * @author Marcos H. Henkes
 */
@RestController
@RequestMapping("/api/replace")
public class ReplaceController {

    @Autowired
    private FoodRepository foodRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private FoodBusiness foodBusiness;

    @PostMapping
    public ResponseEntity<?> getAll(@RequestBody Food food, HttpServletRequest request) {
        if (Objects.isNull(food) || Objects.isNull(food.getCalories())) {
            return ResponseEntity.noContent().build();
        }
        String username = AuthUtils.getLoggedUsername(request.getHeader("Authorization").substring(7));
        Profile profile = profileRepository.findOne(QProfile.profile.userData.username.eq(username));
        Set<Long> foodSet = profile.getFood().stream().map(Food::getId).collect(Collectors.toSet());
        foodSet.add(0L);
        Set<Long> subsSet = profile.getSubstance().stream().map(Substance::getId).collect(Collectors.toSet());
        subsSet.add(0L);

        for (int i = 5; i <= 15; i += 5) {
            List<Pair<Food, BigDecimal>> list = getReplacementList(food, QFood.food.id.notIn(foodSet).and(
                    QFood.food.relatedFood.any().id.notIn(foodSet).or(QFood.food.relatedFood.isEmpty())).and(
                    QFood.food.containedSubstances.any().id.notIn(subsSet).or(QFood.food.containedSubstances.isEmpty())).and(
                    QFood.food.calories.between(food.getCalories().multiply(BigDecimal.valueOf(1-i/100.0)),
                            food.getCalories().multiply(BigDecimal.valueOf(1+i/100.0))
                    )));

            if (!list.isEmpty()) {
                List<Tuple3<Food, BigDecimal, AlergenicInfo>> listWithInfo = list.stream()
                        .map(item -> Tuple3.of(item.getFirst(), item.getSecond(), foodBusiness.getAlergenicInfo(item.getFirst(), username)))
                        .collect(Collectors.toList());
                return ResponseEntity.ok(listWithInfo);
            }
        }

        return ResponseEntity.ok(Collections.emptyList());
    }

    private List<Pair<Food, BigDecimal>> getReplacementList(Food food, Predicate predicate) {
        Iterable<Food> it = foodRepository.findAll(QFood.food.id.ne(food.getId())
                .and(QFood.food.category.eq(food.getCategory())).and(predicate));
        return StreamSupport.stream(it.spliterator(), false)
                .map(f -> Pair.of(f, calcPercentDifference(food.getCarbs(), f.getCarbs())
                        .add(calcPercentDifference(food.getProteins(), f.getProteins()))
                        .add(calcPercentDifference(food.getLipids(), f.getLipids()))
                        .divide(BigDecimal.valueOf(3), 1, RoundingMode.HALF_UP)))
                .collect(Collectors.toList());
    }

    private BigDecimal calcPercentDifference(BigDecimal left, BigDecimal right) {
        BigDecimal leftSafe = Optional.ofNullable(left).orElse(BigDecimal.ZERO);
        BigDecimal rightSafe = Optional.ofNullable(right).orElse(BigDecimal.ZERO);
        return leftSafe.min(rightSafe).divide(leftSafe.max(rightSafe), MathContext.DECIMAL128).multiply(BigDecimal.valueOf(100));
    }

}
