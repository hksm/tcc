package io.github.hksm.constant;

/**
 * @author Marcos H. Henkes
 */
public enum AlergenicInfo implements IEnum {

    DANGER("danger", 0),
    WARNING("warning", 1),
    SAFE("safe", 2);

    private String name;

    private int level;

    AlergenicInfo() {
    }

    AlergenicInfo(String name, int level) {
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
