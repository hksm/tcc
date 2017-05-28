package io.github.hksm.controller;

import com.github.vineey.rql.filter.parser.DefaultFilterParser;
import com.github.vineey.rql.querydsl.sort.OrderSpecifierList;
import com.github.vineey.rql.querydsl.sort.QuerydslSortContext;
import com.github.vineey.rql.sort.parser.DefaultSortParser;
import com.github.vineey.rql.sort.parser.exception.SortParsingException;
import com.google.common.collect.ImmutableList;
import com.mysema.commons.lang.Pair;
import com.querydsl.core.types.Predicate;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.StringExpression;
import cz.jirutka.rsql.parser.RSQLParserException;
import io.github.hksm.business.FoodBusiness;
import io.github.hksm.constant.AlergenicInfo;
import io.github.hksm.entity.Food;
import io.github.hksm.entity.QFood;
import io.github.hksm.entity.Substance;
import io.github.hksm.repository.FoodRepository;
import io.github.hksm.util.AuthUtils;
import io.github.hksm.util.SortParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityNotFoundException;
import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import static com.github.vineey.rql.querydsl.filter.QueryDslFilterContext.withMapping;

/**
 * @author Marcos H. Henkes
 */
@RestController
@RequestMapping("/api/food")
public class FoodController {

    @Autowired
    private FoodRepository foodRepository;

    @Autowired
    private FoodBusiness foodBusiness;

    @PostMapping
    public ResponseEntity<?> add(@RequestBody Food food) {
        Food persisted = foodRepository.save(food);
        if (Objects.nonNull(persisted)) {
            return ResponseEntity.ok(persisted);
        }
        return ResponseEntity.unprocessableEntity().body(food);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOne(@PathVariable("id") long id) {
        Food food = foodRepository.findOne(id);
        if (Objects.nonNull(food)) {
            return ResponseEntity.ok(food);
        }
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(name="size", defaultValue="20") int size, @RequestParam(name="page", defaultValue="1") int page,
                                    @RequestParam(name="filter", defaultValue="") String filter, @RequestParam(name="sort", defaultValue="") String sort) {
        Sort sortBy;
        try {
            String parsed = SortParser.parseString(sort);
            OrderSpecifierList orderSpecifierList = new DefaultSortParser().parse(parsed, QuerydslSortContext.withMapping(Substance.getExpressions()));
            sortBy = SortParser.parse(orderSpecifierList.getOrders());
        } catch (SortParsingException e) {
            sortBy = null;
        }

        Predicate predicate;
        try {
            predicate = new DefaultFilterParser().parse(filter, withMapping(Food.getExpressions()));
        } catch (RSQLParserException e) {
            predicate = null;
        }
        Page<Food> food = foodRepository.findAll(predicate, new PageRequest(--page, size, sortBy));
        return ResponseEntity.ok(food);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchByTerm(@RequestParam(name="term", defaultValue="") String term, HttpServletRequest request) {
        StringExpression expression = Expressions.asString("%").concat(term).concat("%");
        Predicate predicate = QFood.food.name.likeIgnoreCase(expression)
                .or(QFood.food.otherNames.any().likeIgnoreCase(expression))
                .or(QFood.food.containedSubstances.any().name.likeIgnoreCase(expression))
                .or(QFood.food.containedSubstances.any().otherNames.any().likeIgnoreCase(expression));

        String username = AuthUtils.getLoggedUsername(request.getHeader("Authorization").substring(7));

        List<Pair<Food, AlergenicInfo>> food = ImmutableList.copyOf(foodRepository.findAll(predicate)).stream()
                .map(f -> Pair.of(f, foodBusiness.getAlergenicInfo(f, username))).collect(Collectors.toList());
        return ResponseEntity.ok(food);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") long id) {
        try {
            foodRepository.delete(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException | EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(409).body(e.getMessage());
        }

    }
}
