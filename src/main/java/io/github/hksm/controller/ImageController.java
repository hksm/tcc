package io.github.hksm.controller;

import io.github.hksm.entity.Image;
import io.github.hksm.repository.ImageRepositoy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Objects;

/**
 * @author Marcos H. Henkes
 */
@RestController
@RequestMapping("/api/images")
public class ImageController {

    @Autowired
    private ImageRepositoy imageRepositoy;

    @PostMapping
    public ResponseEntity<?> add(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        try {
            Image image = new Image(null, file.getOriginalFilename(), file.getBytes());
            Image persisted = imageRepositoy.save(image);
            if (Objects.nonNull(persisted)) {
                return ResponseEntity.ok(persisted);
            }
        } catch (IOException e) {
            return ResponseEntity.unprocessableEntity().body(file);
        }
        return ResponseEntity.unprocessableEntity().body(file);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOne(@PathVariable("id") long id) {
        Image Image = imageRepositoy.findOne(id);
        if (Objects.nonNull(Image)) {
            return ResponseEntity.ok(Image);
        }
        return ResponseEntity.noContent().build();
    }
}
