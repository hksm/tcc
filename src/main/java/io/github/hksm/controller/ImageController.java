package io.github.hksm.controller;

import io.github.hksm.entity.Image;
import io.github.hksm.repository.ImageRepositoy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Base64;
import java.util.Objects;

/**
 * @author Marcos H. Henkes
 */
@RestController
@RequestMapping("/api/images")
public class ImageController {

    @Autowired
    private ImageRepositoy imageRepositoy;

    @PostMapping()
    public ResponseEntity<?> add(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        try {
            if (Base64.getEncoder().encodeToString(file.getBytes()).equals("iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAsUlEQVR4nO3BAQEAAACCIP+vbkhAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB8GXHmAAFMgHIEAAAAAElFTkSuQmCC")) {
                return ResponseEntity.noContent().build();
            }
            Image image = new Image(null, file.getOriginalFilename(), file.getContentType(), file.getBytes());
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
    public void serve(@PathVariable("id") long id, HttpServletResponse response) throws IOException {
        Image image = imageRepositoy.findOne(id);
        if (Objects.nonNull(image)) {
            response.setHeader("Cache-Control", "no-store");
            response.setHeader("Pragma", "no-cache");
            response.setDateHeader("Expires", 0);
            response.setContentType(image.getMimeType());
            ServletOutputStream responseOutputStream = response.getOutputStream();
            responseOutputStream.write(image.getImage());
            responseOutputStream.flush();
            responseOutputStream.close();
        }
    }

    @GetMapping("/entity/{id}")
    public ResponseEntity<?> get(@PathVariable("id") long id) throws IOException {
        Image image = imageRepositoy.findOne(id);
        if (Objects.nonNull(image)) {
            return ResponseEntity.ok(image);
        }
        return ResponseEntity.noContent().build();
    }
}
