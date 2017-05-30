package io.github.hksm.util;

/**
 * @author Marcos H. Henkes
 */
public class Tuple4<S, T, U, V>  {

    private S first;
    private T second;
    private U third;
    private V fourth;

    public Tuple4(S first, T second, U third, V fourth) {
        this.first = first;
        this.second = second;
        this.third = third;
        this.fourth = fourth;
    }

    public static <S, T, U, V> Tuple4<S, T, U, V> of(S first, T second) {
        return new Tuple4<>(first, second, null, null);
    }

    public static <S, T, U, V> Tuple4<S, T, U, V> of(S first, T second, U third) {
        return new Tuple4<>(first, second, third, null);
    }

    public static <S, T, U, V> Tuple4<S, T, U, V> of(S first, T second, U third, V fourth) {
        return new Tuple4<>(first, second, third, fourth);
    }

    public S getFirst() {
        return first;
    }

    public T getSecond() {
        return second;
    }

    public U getThird() {
        return third;
    }

    public V getFourth() {
        return fourth;
    }
}
