package com.RAP17;

import org.hibernate.cfg.Configuration;
import org.hibernate.*;

public class Main {
    public static void main(String[] args) {
        SessionFactory factory = new Configuration()
                                    .configure("hibernate.cfg.xml") // Carga la configuración del XML
                                    .addAnnotatedClass(Usuarios.class) 
                                    .buildSessionFactory();
 
        Session session = null;
        Transaction transaction = null; 
 
        try {
            session = factory.openSession();
            transaction = session.beginTransaction();
            Usuarios nuevoUsuario = new Usuarios("LuisaR2", "prueba123", "Luisa Rubio", "juan.perez@example.com", "Operador", "preventa");
            session.persist(nuevoUsuario);
            transaction.commit();
 
            System.out.println("Usuario insertado exitosamente con ID: " + nuevoUsuario.getId());
 
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
                System.err.println("La transacción fue revertida debido a un error.");
            }
            System.err.println("Error al insertar usuario: " + e.getMessage());
            e.printStackTrace();
        } finally {
            if (session != null) {
                session.close();
            }
            if (factory != null) {
                factory.close();
            }
        }
    }
}