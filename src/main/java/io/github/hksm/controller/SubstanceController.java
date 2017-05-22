package io.github.hksm.controller;

import com.github.vineey.rql.filter.parser.DefaultFilterParser;
import com.github.vineey.rql.querydsl.filter.QueryDslFilterContext;
import com.github.vineey.rql.querydsl.sort.OrderSpecifierList;
import com.github.vineey.rql.querydsl.sort.QuerydslSortContext;
import com.github.vineey.rql.sort.parser.DefaultSortParser;
import com.github.vineey.rql.sort.parser.exception.SortParsingException;
import com.querydsl.core.types.Predicate;
import cz.jirutka.rsql.parser.RSQLParserException;
import io.github.hksm.entity.Substance;
import io.github.hksm.repository.SubstanceRepository;
import io.github.hksm.util.SortParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityNotFoundException;
import java.util.Objects;

/**
 * @author Marcos H. Henkes
 */
@RestController
@RequestMapping("/api/substance")
public class SubstanceController {

    @Autowired
    private SubstanceRepository substanceRepository;

    @PostMapping
    public ResponseEntity<?> add(@RequestBody Substance substance) {
        Substance persisted = substanceRepository.save(substance);
        if (Objects.nonNull(persisted)) {
            return ResponseEntity.ok(persisted);
        }
        return ResponseEntity.unprocessableEntity().body(substance);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOne(@PathVariable("id") long id) {
        Substance substance = substanceRepository.findOne(id);
        if (Objects.nonNull(substance)) {
            return ResponseEntity.ok(substance);
        }
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(name = "size", defaultValue = "20") int size,
                                    @RequestParam(name = "page", defaultValue = "1") int page,
                                    @RequestParam(name = "filter", defaultValue = "") String filter,
                                    @RequestParam(name = "sort", defaultValue = "") String sort) {
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
            predicate = new DefaultFilterParser().parse(filter, QueryDslFilterContext.withMapping(Substance.getExpressions()));
        } catch (RSQLParserException e) {
            predicate = null;
        }
        Page<Substance> substance = substanceRepository.findAll(predicate, new PageRequest(--page, size, sortBy));
        return ResponseEntity.ok(substance);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") long id) {
        try {
            substanceRepository.delete(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException | EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }

    }
}
