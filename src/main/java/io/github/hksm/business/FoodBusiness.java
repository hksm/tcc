package io.github.hksm.business;

import io.github.hksm.constant.AlergenicInfo;
import io.github.hksm.entity.Food;
import io.github.hksm.entity.Profile;
import io.github.hksm.entity.QProfile;
import io.github.hksm.entity.Substance;
import io.github.hksm.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

/**
 * @author Marcos H. Henkes
 */
@Component
public class FoodBusiness {

    @Autowired
    private ProfileRepository profileRepository;

    public AlergenicInfo getAlergenicInfo(Food food, String username) {
        Profile profile = profileRepository.findOne(QProfile.profile.userData.username.eq(username));

        if (profile != null) {
            Set<Long> foodSet = profile.getFood().stream().map(Food::getId).collect(Collectors.toSet());
            Set<Long> subsSet = profile.getSubstance().stream().map(Substance::getId).collect(Collectors.toSet());

            if (foodSet.stream().anyMatch(id -> id.equals(food.getId()) || food.getRelatedFood().stream().map(Food::getId).anyMatch(i -> i.equals(id)))) {
                return AlergenicInfo.DANGER;
            }
            if (subsSet.stream().anyMatch(id -> food.getContainedSubstances().stream().map(Substance::getId).anyMatch(i -> i.equals(id)))) {
                return AlergenicInfo.DANGER;
            }
        }

        if (food.isAlergenic() || food.getRelatedFood().stream().anyMatch(Food::isAlergenic)
                || food.getContainedSubstances().stream().anyMatch(Substance::isAlergenic)) {
            return AlergenicInfo.WARNING;
        }
        return AlergenicInfo.SAFE;
    }
}
