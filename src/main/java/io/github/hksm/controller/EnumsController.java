package io.github.hksm.controller;

import io.github.hksm.constant.Category;
import io.github.hksm.constant.IEnum;
import io.github.hksm.constant.Unit;
import io.github.hksm.util.Maps;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * @author Marcos H. Henkes
 */
@RestController
@RequestMapping("/api/enums")
public class EnumsController {

    @RequestMapping(method = RequestMethod.OPTIONS)
    public ResponseEntity<?> getEnums() {
        Map<Object, List<Map<String, Object>>> enums = Stream.<IEnum[]>of(Category.values(), Unit.values())
                .flatMap(Stream::of).map(e -> Maps.of("enum", e, "name", e.getName(), "level", e.getLevel()))
                .collect(Collectors.groupingBy(e -> e.get("enum").getClass().getSimpleName().toLowerCase()));
        return ResponseEntity.ok(enums);
    }
}
