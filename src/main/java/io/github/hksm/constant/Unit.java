package io.github.hksm.constant;

/**
 * @author Marcos H. Henkes
 */
public enum Unit implements IEnum {

    PORCAO("Porção", 0),
    GRAMAS("Gramas", 1);

    private String name;

    private int level;

    Unit() {
    }

    Unit(String name, int level) {
        this.name = name;
        this.level = level;
    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public int getLevel() {
        return level;
    }

}
