package io.github.hksm.util;

import java.util.AbstractMap;
import java.util.Collections;
import java.util.Map;
import java.util.concurrent.ConcurrentMap;
import java.util.stream.Collector;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * @author Marcos H. Henkes
 */
public class Maps {

    public static <K, V> Map<K, V> of(K key1, V value1) {
        return Collections.unmodifiableMap(Stream.of(
                entry(key1, value1))
                .collect(entriesToMap()));
    }

    public static <K, V> Map<K, V> of(K key1, V value1, K key2, V value2) {
        return Collections.unmodifiableMap(Stream.of(
                entry(key1, value1),
                entry(key2, value2))
                .collect(entriesToMap()));
    }

    public static <K, V> Map<K, V> of(K key1, V value1, K key2, V value2, K key3, V value3) {
        return Collections.unmodifiableMap(Stream.of(
                entry(key1, value1),
                entry(key2, value2),
                entry(key3, value3))
                .collect(entriesToMap()));
    }

    public static <K, V> Map<K, V> of(K key1, V value1, K key2, V value2, K key3, V value3, K key4, V value4) {
        return Collections.unmodifiableMap(Stream.of(
                entry(key1, value1),
                entry(key2, value2),
                entry(key3, value3),
                entry(key4, value4))
                .collect(entriesToMap()));
    }

    public static <K, V> Map<K, V> of(K key1, V value1, K key2, V value2, K key3, V value3, K key4, V value4, K key5, V value5) {
        return Collections.unmodifiableMap(Stream.of(
                entry(key1, value1),
                entry(key2, value2),
                entry(key3, value3),
                entry(key4, value4),
                entry(key5, value5))
                .collect(entriesToMap()));
    }

    public static <K, V> Map<K, V> of(K key1, V value1, K key2, V value2, K key3, V value3, K key4, V value4, K key5, V value5, K key6, V value6) {
        return Collections.unmodifiableMap(Stream.of(
                entry(key1, value1),
                entry(key2, value2),
                entry(key3, value3),
                entry(key4, value4),
                entry(key5, value5),
                entry(key6, value6))
                .collect(entriesToMap()));
    }

    public static <K, V> Map.Entry<K, V> entry(K key, V value) {
        return new AbstractMap.SimpleEntry<>(key, value);
    }

    public static <K, U> Collector<Map.Entry<K, U>, ?, Map<K, U>> entriesToMap() {
        return Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue);
    }

    public static <K, U> Collector<Map.Entry<K, U>, ?, ConcurrentMap<K, U>> entriesToConcurrentMap() {
        return Collectors.toConcurrentMap(Map.Entry::getKey, Map.Entry::getValue);
    }
}
