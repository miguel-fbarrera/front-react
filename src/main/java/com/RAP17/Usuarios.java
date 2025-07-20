package com.RAP17;
 
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
 
 
@Entity
 
@Table(name = "usuarios") // nombre de la tabla
public class Usuarios {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;
 
    @Column(name = "username")
    private String username;
 
    @Column(name = "password")
    private String password;
 
    @Column(name = "nombre")
    private String nombre;
 
    @Column(name = "correo")
    private String correo;
 
    @Column(name = "rol")
    private String rol;
 
    @Column(name = "area")
    private String area;
 
    public Usuarios() {
    }
 
    public Usuarios(String username, String password, String nombre, String correo, String rol, String area) {
        this.username = username;
        this.password = password;
        this.nombre = nombre;
        this.correo = correo;
        this.rol = rol;
        this.area = area;
    }
   
    // Getters y Setters
    public int getId() {
        return id;
    }
 
    public void setId(int id) {
        this.id = id;
    }
 
    public String getUsername() {
        return username;
    }
 
    public void setUsername(String username) {
        this.username = username;
    }
 
    public String getPassword() {
        return password;
    }
 
    public void setPassword(String password) {
        this.password = password;
    }
 
    public String getNombre() {
        return nombre;
    }
 
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
 
    public String getCorreo() {
        return correo;
    }
 
    public void setCorreo(String correo) {
        this.correo = correo;
    }
 
    public String getRol() {
        return rol;
    }
 
    public void setRol(String rol) {
        this.rol = rol;
    }
 
    public String getArea() {
        return area;
    }
 
    public void setArea(String area) {
        this.area = area;
    }
 
    // Opcional: toString() para facilitar la depuración
    @Override
    public String toString() {
        return "Usuario [id=" + id + ", username=" + username + ", nombre=" + nombre + ", correo=" + correo + ", rol=" + rol + ", area=" + area + "]";
    }
}