package io.github.hksm.util;

/**
 * @author Marcos H. Henkes
 */
public class Tuple3<S, T, U>  {

    private S first;
    private T second;
    private U third;

    public Tuple3(S first, T second, U third) {
        this.first = first;
        this.second = second;
        this.third = third;
    }

    public static <S, T, U> Tuple3<S, T, U> of(S first, T second, U third) {
        return new Tuple3<>(first, second, third);
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
}
