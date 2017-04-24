package io.github.hksm.controller;

import io.github.hksm.constant.Category;
import io.github.hksm.util.Maps;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.stream.Collectors;

/**
 * @author Marcos H. Henkes
 */
@RestController
@RequestMapping("/enums")
public class EnumsController {

    @RequestMapping(method = RequestMethod.OPTIONS)
    public ResponseEntity<?> getEnums() {
        return ResponseEntity.ok(Arrays.stream(Category.values())
                .map(category -> Maps.of("enum", category, "name", category.getName(), "level", category.getLevel()))
                .collect(Collectors.toList()));
    }
}
