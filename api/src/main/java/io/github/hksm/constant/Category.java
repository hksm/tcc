package io.github.hksm.constant;

/**
 * @author Marcos H. Henkes
 */
public enum Category {

    CEREAIS("Cereais e derivados", 0),
    FRUTAS("Frutas e hortaliças", 1),
    CARNES("Carnes, aves, peixes, ovos e leguminosas", 2),
    LEITE("Leite e derivados", 3),
    GORDURAS("Gorduras, óleos e doces", 4);

    private String name;

    private int level;

    Category() {
    }

    Category(String name, int level) {
        this.name = name;
        this.level = level;
    }

    public String getName() {
        return name;
    }

    public int getLevel() {
        return level;
    }

}
