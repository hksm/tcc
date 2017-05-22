package io.github.hksm.util;

import com.querydsl.core.types.OrderSpecifier;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.stream.Collectors;

/**
 * @author Marcos H. Henkes
 */
public class SortParser {

    public static Sort parse(List<OrderSpecifier> orderSpecifiers) {
        return new Sort(orderSpecifiers.stream().map(order -> {
            String expressionPath = order.getTarget().toString();
            String[] paths = expressionPath.split("\\.");
            String property = paths[paths.length - 1];
            return new Sort.Order(Sort.Direction.valueOf(order.getOrder().toString()), property);
        }).collect(Collectors.toList()));
    }

    public static String parseString(String sort) {
        StringBuilder builder = new StringBuilder();
        if (!sort.startsWith("sort")) {
            builder.append("sort(");
        }
        if (!sort.contains("+") && !sort.contains("-")) {
            builder.append("+");
        }
        if (builder.length() > 0) {
            return builder.append(sort).append(")").toString();
        }
        return sort;
    }

}
