package io.github.hksm.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.validation.constraints.NotNull;

/**
 * @author Marcos H. Henkes
 */
@Entity
public class Image {

    @Id
    @GeneratedValue
    private Long id;

    @NotNull
    private String filename;

    @NotNull
    private String mimeType;

    @Lob
    @NotNull
    private byte[] image;

    public Image() {
    }

    public Image(Long id, String filename, String mimeType, byte[] image) {
        this.id = id;
        this.filename = filename;
        this.mimeType = mimeType;
        this.image = image;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getMimeType() {
        return mimeType;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }
}
