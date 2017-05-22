package io.github.hksm.entity;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Set;

/**
 * @author Marcos H. Henkes
 */
@Entity
public class UserData {

    @Id @GeneratedValue
    private Long id;

    @NotNull @Column(unique=true)
    private String username;

    @NotNull
    private String password;

    @ElementCollection
    @CollectionTable(name = "UserRoles")
    private Set<String> roles = new HashSet<>();

    @NotNull
    private boolean enabled;

    public UserData() {
    }

    public UserData(UserData userData) {
        this.id = userData.getId();
        this.username = userData.getUsername();
        this.password = userData.getPassword();
        this.roles = userData.getRoles();
        this.enabled = userData.isEnabled();
    }


    public UserData(Long id, String username, String password, Set<String> roles, boolean enabled) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.roles = roles;
        this.enabled = enabled;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public static UserData.Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String username;
        private String password;
        private Set<String> roles;
        private boolean enabled;

        private Builder() {
        }

        public UserData build() {
            return new UserData(id, username, password, roles, enabled);
        }

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder username(String username) {
            this.username = username;
            return this;
        }

        public Builder password(String password) {
            this.password = password;
            return this;
        }

        public Builder roles(Set<String> roles) {
            this.roles = roles;
            return this;
        }

        public Builder enabled(boolean enabled) {
            this.enabled = enabled;
            return this;
        }
    }
}
