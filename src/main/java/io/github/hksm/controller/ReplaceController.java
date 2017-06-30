package io.github.hksm.controller;

import com.google.common.base.Strings;
import com.mysema.commons.lang.Pair;
import com.querydsl.core.types.Predicate;
import io.github.hksm.business.FoodBusiness;
import io.github.hksm.constant.AlergenicInfo;
import io.github.hksm.entity.*;
import io.github.hksm.repository.FavoriteRepository;
import io.github.hksm.repository.FoodRepository;
import io.github.hksm.repository.ProfileRepository;
import io.github.hksm.util.AuthUtils;
import io.github.hksm.util.Tuple4;
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
    private FavoriteRepository favoriteRepository;

    @Autowired
    private FoodBusiness foodBusiness;

    @PostMapping
    public ResponseEntity<?> getAll(@RequestBody Food food, HttpServletRequest request) {
        if (Strings.isNullOrEmpty(request.getHeader("Authorization"))) {
            return ResponseEntity.noContent().build();
        }

        if (Objects.isNull(food) || Objects.isNull(food.getCalories())) {
            return ResponseEntity.noContent().build();
        }
        String username = AuthUtils.getLoggedUsername(request.getHeader("Authorization").substring(7));
        Profile profile = profileRepository.findOne(QProfile.profile.userData.username.eq(username));

        Set<Long> foodSet;
        Set<Long> subsSet;

        if (profile != null) {
            foodSet = profile.getFood().stream().map(Food::getId).collect(Collectors.toSet());
            foodSet.add(0L);
            subsSet = profile.getSubstance().stream().map(Substance::getId).collect(Collectors.toSet());
            subsSet.add(0L);
        } else {
            foodSet = Collections.singleton(0L);
            subsSet = Collections.singleton(0L);
        }
        for (int i : new int[]{10, 20, 35}) {
            List<Pair<Food, BigDecimal>> list = getReplacementList(food, QFood.food.id.notIn(foodSet).and(
                    QFood.food.relatedFood.any().id.notIn(foodSet).or(QFood.food.relatedFood.isEmpty())).and(
                    QFood.food.containedSubstances.any().id.notIn(subsSet).or(QFood.food.containedSubstances.isEmpty())).and(
                    QFood.food.calories.between(food.getCalories().multiply(BigDecimal.valueOf(1-i/100.0)),
                            food.getCalories().multiply(BigDecimal.valueOf(1+i/100.0))
                    )));

            if (!list.isEmpty()) {
                List<Tuple4<Food, BigDecimal, AlergenicInfo, Long>> listWithInfo = list.stream()
                        .map(item -> Tuple4.of(item.getFirst(), item.getSecond(),
                                foodBusiness.getAlergenicInfo(item.getFirst(), username), getFavorite(item.getFirst(), username)))
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
        if (rightSafe.compareTo(BigDecimal.ZERO) == 0 && leftSafe.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.valueOf(100);
        }
        if (rightSafe.compareTo(BigDecimal.ZERO) == 0 || leftSafe.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return leftSafe.min(rightSafe).divide(leftSafe.max(rightSafe), MathContext.DECIMAL128).multiply(BigDecimal.valueOf(100));
    }

    private Long getFavorite(Food food, String username) {
        return Optional.ofNullable(favoriteRepository.findOne(QFavorite.favorite.food.id.eq(food.getId())
                .and(QFavorite.favorite.userData.username.eq(username)))).map(Favorite::getId).orElse(null);
    }

}
