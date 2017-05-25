package io.github.hksm.controller;

import com.mysema.commons.lang.Pair;
import io.github.hksm.entity.Food;
import io.github.hksm.entity.QFood;
import io.github.hksm.repository.FoodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.MathContext;
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

    @PostMapping
    public ResponseEntity<?> getAll(@RequestBody Food food) {
        Iterable<Food> it = foodRepository.findAll(QFood.food.calories.between(food.getCalories().multiply(BigDecimal.valueOf(0.95)),
                food.getCalories().multiply(BigDecimal.valueOf(1.05))));
        List<Pair<Food, BigDecimal>> orderedMap = StreamSupport.stream(it.spliterator(), false)
                .map(f -> Pair.of(f, calcPercentDifference(food.getCarbs(), f.getCarbs())
                        .add(calcPercentDifference(food.getProteins(), f.getProteins()))
                        .add(calcPercentDifference(food.getLipids(), f.getLipids()))))
                .collect(Collectors.toList());
        return ResponseEntity.ok(orderedMap);
    }

    private BigDecimal calcPercentDifference(BigDecimal left, BigDecimal right) {
        BigDecimal leftSafe = Optional.ofNullable(left).orElse(BigDecimal.ZERO);
        BigDecimal rightSafe = Optional.ofNullable(right).orElse(BigDecimal.ZERO);
        return leftSafe.min(rightSafe).divide(leftSafe.max(rightSafe), MathContext.DECIMAL128).multiply(BigDecimal.valueOf(100));
    }

}
