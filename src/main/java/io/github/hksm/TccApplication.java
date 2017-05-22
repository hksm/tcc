package io.github.hksm;

import com.google.common.collect.ImmutableSet;
import io.github.hksm.filter.JwtFilter;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class TccApplication {

	public static void main(String[] args) {
		SpringApplication.run(TccApplication.class, args);
	}

	@Bean
	public FilterRegistrationBean jwtFilter() {
		final FilterRegistrationBean registrationBean = new FilterRegistrationBean();
		registrationBean.setFilter(new JwtFilter());
		registrationBean.setUrlPatterns(ImmutableSet.of(
				"/api/food/*",
				"/api/substance/*",
				"/api/profile/*",
				"/api/auth/role/*"));
		return registrationBean;
	}

}
