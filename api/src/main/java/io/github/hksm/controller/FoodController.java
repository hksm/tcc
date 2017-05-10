package io.github.hksm.controller;

import com.github.vineey.rql.filter.parser.DefaultFilterParser;
import com.github.vineey.rql.querydsl.sort.OrderSpecifierList;
import com.github.vineey.rql.querydsl.sort.QuerydslSortContext;
import com.github.vineey.rql.sort.parser.DefaultSortParser;
import com.github.vineey.rql.sort.parser.exception.SortParsingException;
import com.google.common.collect.ImmutableList;
import com.querydsl.core.types.Predicate;
import cz.jirutka.rsql.parser.RSQLParserException;
import io.github.hksm.entity.Food;
import io.github.hksm.entity.QFood;
import io.github.hksm.entity.Substance;
import io.github.hksm.repository.FoodRepository;
import io.github.hksm.util.SortParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Objects;

import static com.github.vineey.rql.querydsl.filter.QueryDslFilterContext.withMapping;

/**
 * @author Marcos H. Henkes
 */
@RestController
@RequestMapping("/food")
public class FoodController {

    @Autowired
    private FoodRepository foodRepository;

    @PostMapping
    public ResponseEntity<?> add(@RequestBody Food food) {
        Food persisted = foodRepository.save(food);
        if (Objects.nonNull(persisted)) {
            return ResponseEntity.ok(persisted);
        }
        return ResponseEntity.unprocessableEntity().body(food);
    }

    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(name="size", defaultValue="20") int size,
                                    @RequestParam(name="page", defaultValue="1") int page,
                                    @RequestParam(name="filter", defaultValue="") String filter,
                                    @RequestParam(name="sort", defaultValue="") String sort) {
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
    public ResponseEntity<?> searchByTerm(@RequestParam(name="term", defaultValue="") String term) {
        Predicate predicate = QFood.food.name.likeIgnoreCase(term)
                .or(QFood.food.otherNames.any().likeIgnoreCase(term))
                .or(QFood.food.tags.any().likeIgnoreCase(term))
                .or(QFood.food.containedSubstances.any().name.likeIgnoreCase(term));
        List<Food> food = ImmutableList.copyOf(foodRepository.findAll(predicate));
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
