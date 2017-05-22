package io.github.hksm.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @author Marcos H. Henkes
 */
@Controller
public class AngularJsForwardController {

    @RequestMapping({ "/login", "/register", "/food/**", "/substance/**", "/profile/**", "/home/**", "/search/**", "/replace/**" })
    public String index() {
        return "forward:/";
    }

}
