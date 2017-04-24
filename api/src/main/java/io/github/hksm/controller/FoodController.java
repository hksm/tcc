package io.github.hksm.controller;

import com.github.vineey.rql.filter.parser.DefaultFilterParser;
import com.querydsl.core.types.Predicate;
import cz.jirutka.rsql.parser.RSQLParserException;
import io.github.hksm.entity.Food;
import io.github.hksm.repository.FoodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityNotFoundException;
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
    public ResponseEntity<?> getAll(@RequestParam(name = "size", defaultValue = "20") int size,
                                    @RequestParam(name = "page", defaultValue = "0") int page,
                                    @RequestParam(name = "filter", defaultValue = "") String filter) {
        DefaultFilterParser filterParser = new DefaultFilterParser();
        Predicate predicate;
        try {
            predicate = filterParser.parse(filter, withMapping(Food.getExpressions()));
        } catch (RSQLParserException e) {
            predicate = null;
        }
        Page<Food> food = foodRepository.findAll(predicate, new PageRequest(page, size));
        return ResponseEntity.ok(food);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") long id) {
        try {
            foodRepository.delete(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException | EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }

    }
}
