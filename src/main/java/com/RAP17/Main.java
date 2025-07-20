package com.RAP17;

import org.hibernate.cfg.Configuration;
import org.hibernate.*;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.List;

@WebServlet(name = "Main", urlPatterns = {"/registrar", "/ingreso", "/consultar", "/eliminarUsuario", "/editarusuario", "/buscarusuario"})
@MultipartConfig 
public class Main extends HttpServlet{

    private static SessionFactory factory;
    private static Session session;
    private static Transaction transaction;

    @Override
    public void init() throws ServletException {
        // Inicializa Hibernate en servlet
        factory = new Configuration()
                .configure("hibernate.cfg.xml")
                .addAnnotatedClass(Usuarios.class)
                .buildSessionFactory();
    }
/*
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
            Usuarios nuevoUsuario = new Usuarios("LuisaR3", "prueba123", "Luisa Rubio", "juan.perez@example.com", "Operador", "preventa");
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
*/
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String path = request.getServletPath();

        System.out.println("Ruta solicitada: " + path);
        switch (path) {
            case "/registrar":
                registrarUsuario(request, response);
                break;
            case "/ingreso":
                verificarIngreso(request, response);
                break;
            case "/editarusuario":
                editarUsuario(request, response);
                break;
            case "/buscarusuario":
                buscarUsuario(request, response);
                break;
            default:
                response.sendError(HttpServletResponse.SC_NOT_FOUND, "Ruta no válida");
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String path = request.getServletPath();

        switch (path) {
            case "/consultar":
                consultarUsuarios(request, response);
                break;
            case "/eliminarUsuario":
                eliminarUsuario(request, response);
                break;
            
            default:
                response.sendError(HttpServletResponse.SC_NOT_FOUND, "Ruta no válida");
        }
    }

    private void verificarIngreso(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        System.out.println("Usuario: " + username);
        System.out.println("Contraseña: " + password);
        try{
            if ("admin".equals(username) && "sena123".equals(password)) {
                //response.getWriter().write("Ingreso exitoso. Bienvenido, "+username);
                response.sendRedirect("usuarios.html");
            } else {
                response.getWriter().write("<script>alert('Credenciales incorrectas'); window.location.href='index.html';</script>");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error en ingreso");
        }
    }

    private void registrarUsuario(HttpServletRequest request, HttpServletResponse response) throws IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");
        String nombre = request.getParameter("nombre");
        String correo = request.getParameter("correo");
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        String rol = request.getParameter("rol");
        String area = request.getParameter("area");
        
        Usuarios nuevoUsuario = new Usuarios(username, password, nombre, correo, rol, area);

        try {
            session = factory.openSession();
            transaction = session.beginTransaction();
            session.persist(nuevoUsuario);
            transaction.commit();
            response.getWriter().write("Usuario registrado exitosamente");
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
                System.err.println("Error en el registro");
            }
            System.err.println("Error al insertar usuario: " + e.getMessage());
            e.printStackTrace();
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }

    private void consultarUsuarios(HttpServletRequest request, HttpServletResponse response) 
            throws IOException {
        response.setContentType("application/json");
        try {
            session = factory.openSession();
            List<Usuarios> usuarios = session.createQuery("from Usuarios", Usuarios.class).list();
            
            StringBuilder json = new StringBuilder("[");
            for (int i = 0; i < usuarios.size(); i++) {
                Usuarios u = usuarios.get(i);
                json.append("{\"id\":\"").append(u.getId())
                    .append("\",\"nombre\":\"").append(u.getNombre())
                    .append("\"}");
                if (i < usuarios.size() - 1) json.append(",");
            }
            json.append("]");
            
            response.getWriter().write(json.toString());
        } catch (Exception e) {
            response.getWriter().write("{\"error\": \"" + e.getMessage() + "\"}");
            e.printStackTrace();
        } finally {
            if (session != null) session.close();
        }
    }



    private void eliminarUsuario(HttpServletRequest request, HttpServletResponse response) 
            throws IOException {

        String id = request.getParameter("id");
     
        try {
            session = factory.openSession();
            transaction = session.beginTransaction();

            Usuarios eliminaUsuario = (Usuarios) session.find(Usuarios.class, id);

            if(eliminaUsuario != null) {
                response.getWriter().write("Usuario encontrado");
                session.remove(eliminaUsuario);
                transaction.commit();
            }else{
                response.getWriter().write("No encontrado "+id);
            }
            // Estatus del commit
            // response.getWriter().write("\n 2. "+transaction.getStatus());
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
                System.err.println("Error en el registro");
            }
            System.err.println("Error al insertar usuario: " + e.getMessage());
            e.printStackTrace();
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }


    private void buscarUsuario(HttpServletRequest request, HttpServletResponse response) 
            throws IOException {
        response.setContentType("application/json");
        try {
            String id = request.getParameter("id");

            session = factory.openSession();
            Usuarios usuario = session.find(Usuarios.class, id);

            if (usuario != null) {
                String json = String.format(
                    "{\"id\":\"%s\",\"nombre\":\"%s\",\"correo\":\"%s\"," +
                    "\"username\":\"%s\",\"password\":\"%s\",\"rol\":\"%s\",\"area\":\"%s\"}",
                    usuario.getId(), usuario.getNombre(), usuario.getCorreo(),
                    usuario.getUsername(), usuario.getPassword(), usuario.getRol(),
                    usuario.getArea());
                response.getWriter().write(json);
            } else {
                response.getWriter().write("{\"error\": \"Usuario no encontrado\"}");
            }
        } catch (Exception e) {
            response.getWriter().write("{\"errorbus\": \"" + e.getMessage() + "\"}");
            e.printStackTrace();
        } finally {
            if (session != null) session.close();
        }
    }

    private void editarUsuario(HttpServletRequest request, HttpServletResponse response) 
            throws IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");
        
        try {
            session = factory.openSession();
            transaction = session.beginTransaction();

            Usuarios viejoUsuario = session.find(Usuarios.class, request.getParameter("id"));

            viejoUsuario.setNombre(request.getParameter("nombre"));
            viejoUsuario.setCorreo(request.getParameter("correo"));
            viejoUsuario.setUsername(request.getParameter("username"));
            viejoUsuario.setPassword(request.getParameter("password"));
            viejoUsuario.setRol(request.getParameter("rol"));
            viejoUsuario.setArea(request.getParameter("area"));

            session.merge(viejoUsuario);
            transaction.commit();
            response.getWriter().write("{\"success\": true, \"message\": \"Usuario actualizado exitosamente\"}");
        } catch (Exception e) {
        if (transaction != null && transaction.isActive()) {
            try {
                transaction.rollback();
            } catch (Exception re) {
                System.err.println("Error during rollback: " + re.getMessage());
            }
        }
        response.getWriter().write("{\"success\": false, \"error\": \"" + e.getMessage() + "\"}");
        e.printStackTrace();
    } finally {
        if (session != null) {
            session.close();
        }
    }
    }
}