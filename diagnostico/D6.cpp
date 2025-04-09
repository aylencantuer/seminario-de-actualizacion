#include <iostream>
#include <string>
#include <vector>

using namespace std;

class Client {
private:
    string username;
    string password;
public:
    Client(string u, string p) : username(u), password(p) {}
    string getUsername() { return username; }
    string getPassword() { return password; }
    void setPassword(string newPassword) { password = newPassword; }
};

class Article {
private:
    int id;
    string nombre;
    float precio;
    int stock;
public:
    Article(int id, string nombre, float precio, int stock)
      : id(id), nombre(nombre), precio(precio), stock(stock) {}
    int getid() { return id; }
    string getNombre() { return nombre; }
    float getPrecio() { return precio; }
    int getStock() { return stock; }

    void setNombre(string nuevoNombre) { nombre = nuevoNombre; }
    void setPrecio(float nuevoPrecio) { precio = nuevoPrecio; }
    void setStock(int nuevoStock) { stock = nuevoStock; }
};

bool validarPassword(const string& password) {
    if (password.length() < 8 || password.length() > 16) {
        cout << "\nLa contrasena debe tener entre 8 y 16 caracteres.\n";
        return false;
    }
    int mayusculas = 0, simbolos = 0;
    for (char c : password) {
        if (c >= 'A' && c <= 'Z') mayusculas++;
        if (!((c >= '0' && c <= '9') ||
              (c >= 'a' && c <= 'z') ||
              (c >= 'A' && c <= 'Z')))
            simbolos++;
    }
    if (mayusculas < 1) {
        cout << "\nLa contrasena debe tener al menos una mayuscula.\n";
        return false;
    }
    if (simbolos < 2) {
        cout << "\nLa contrasena debe tener al menos dos simbolos especiales.\n";
        return false;
    }
    return true;
}

int main() {
    vector<Client> clients = {
        Client("Aylen", "Aylen@1234"),
        Client("Gabi", "Gabi@0456"),
        Client("Silvi", "Silvi@0440")
    };

    vector<Article> articles = {
        Article(1, "Lavandina x 1L",     875.25, 3000),
        Article(4, "Detergente x 500mL",1102.45, 2010),
        Article(2, "Jabon en polvo x 250ML",650.22, 407)
    };

    string username, password;
    int intentos = 0;
    bool acceso = false;

    while (true) {
        int opcionMenu;
        cout << "\nMenu Principal:\n"
             << "1. Listar Articulos\n"
             << "2. Nuevo Articulo\n"
             << "3. Editar Articulo\n"
             << "4. Eliminar Articulo\n"
             << "5. Iniciar sesion\n"
             << "6. Crear cuenta de usuario\n"
             << "Ingrese el numero de la opcion deseada (1-6): ";
        cin >> opcionMenu;

        if (opcionMenu == 1) {              // Listar artículos
            cout << "\nListado de Artículos:\n";
            for (auto& articulo : articles) {
                cout << "ID: "       << articulo.getid()
                     << " | Nombre: " << articulo.getNombre()
                     << " | Precio: $"<< articulo.getPrecio()
                     << " | Stock: "  << articulo.getStock()
                     << endl;
            }
        }
        else if (opcionMenu == 2) {         // Nuevo artículo
            int id, stock;
            float precio;
            string nombre;

            cout << "\nIngrese ID del nuevo artículo: ";
            cin >> id;

            bool existe = false;
            for (auto& articulo : articles) {
                if (articulo.getid() == id) {
                    existe = true;
                    break;
                }
            }
            if (existe) {
                cout << "Ya existe un artículo con ese ID.\n";
            } else {
                cout << "Nombre: ";
                cin.ignore();
                getline(cin, nombre);
                cout << "Precio: ";
                cin >> precio;
                cout << "Stock: ";
                cin >> stock;

                articles.push_back(Article(id, nombre, precio, stock));
                cout << "Artículo creado exitosamente.\n";
            }
        }
        else if (opcionMenu == 3) {         // Editar artículo
            int id;
            cout << "\nIngrese ID del artículo a editar: ";
            cin >> id;

            bool encontrado = false;
            for (auto& articulo : articles) {
                if (articulo.getid() == id) {
                    string nuevoNombre;
                    float nuevoPrecio;
                    int nuevoStock;

                    cout << "Nuevo nombre: ";
                    cin.ignore();
                    getline(cin, nuevoNombre);
                    cout << "Nuevo precio: ";
                    cin >> nuevoPrecio;
                    cout << "Nuevo stock: ";
                    cin >> nuevoStock;

                    articulo.setNombre(nuevoNombre);
                    articulo.setPrecio(nuevoPrecio);
                    articulo.setStock(nuevoStock);

                    cout << "Artículo actualizado correctamente.\n";
                    encontrado = true;
                    break;
                }
            }
            if (!encontrado) {
                cout << "No se encontró el artículo con ese ID.\n";
            }
        }
        else if (opcionMenu == 4) {         // Eliminar artículo
            int id;
            cout << "\nIngrese ID del artículo a eliminar: ";
            cin >> id;

            bool eliminado = false;
            for (auto it = articles.begin(); it != articles.end(); ++it) {
                if (it->getid() == id) {
                    articles.erase(it);
                    cout << "Artículo eliminado correctamente.\n";
                    eliminado = true;
                    break;
                }
            }
            if (!eliminado) {
                cout << "No se encontró el artículo con ese ID.\n";
            }
        }

        else if (opcionMenu == 5) { // Comprar artículo
            int idCompra, cantidadCompra;
            bool encontrado = false;
        
            cout << "\n--- Comprar Artículo ---\n";
            cout << "Listado de artículos disponibles:\n";
            for (auto& articulo : articles) {
                cout << "ID: " << articulo.getid()
                     << " | Nombre: " << articulo.getNombre()
                     << " | Precio: $" << articulo.getPrecio()
                     << " | Stock: " << articulo.getStock() << endl;
            }
        
            cout << "\nIngrese el ID del artículo que desea comprar: ";
            cin >> idCompra;
        
            for (auto& articulo : articles) {
                if (articulo.getid() == idCompra) {
                    encontrado = true;
        
                    if (articulo.getStock() <= 0) {
                        cout << "Lo sentimos, el artículo no tiene stock disponible.\n";
                        break;
                    }
        
                    cout << "Ingrese la cantidad que desea comprar: ";
                    cin >> cantidadCompra;
        
                    if (cantidadCompra <= 0) {
                        cout << "Cantidad inválida. Operación cancelada.\n";
                        break;
                    }
        
                    if (cantidadCompra > articulo.getStock()) {
                        cout << "No hay suficiente stock. Stock disponible: "
                             << articulo.getStock() << "\n";
                        break;
                    }
        
                    articulo.setStock(articulo.getStock() - cantidadCompra);
                    cout << "Compra realizada con éxito. ¡Gracias por su compra!\n";
                    break;
                }
            }
        
            if (!encontrado) {
                cout << "No se encontró ningún artículo con ese ID.\n";
            }
        }
        

        else if (opcionMenu == 6) {         // Iniciar sesión
            cout << "Ingrese su nombre de usuario: ";
            cin >> username;
            cout << "Ingrese su password: ";
            cin >> password;

            acceso = false;
            for (int i = 0; i < (int)clients.size(); i++) {
                if (clients[i].getUsername() == username
                 && clients[i].getPassword() == password) {
                    cout << "Bienvenido/a " << username << "!\n";
                    acceso = true;

                    int opcion;
                    do {
                        cout << "\nMenu de opciones:\n"
                             << "1. Cambiar password\n"
                             << "2. Volver al login\n"
                             << "Ingrese la opcion deseada (1 o 2): ";
                        cin >> opcion;

                        if (opcion == 1) {
                            string newPassword;
                            cout << "\nIngrese su nueva password: ";
                            cin >> newPassword;
                            while (!validarPassword(newPassword)) {
                                cout << "\nIngrese una nueva password que cumpla los requisitos: ";
                                cin >> newPassword;
                            }
                            clients[i].setPassword(newPassword);
                            cout << "\nPassword cambiada exitosamente.\n";
                        }
                        else if (opcion == 2) {
                            cout << "\nVolviendo al login...\n";
                        }
                        else {
                            cout << "\nOpcion invalida. Intente de nuevo.\n";
                        }
                    } while (opcion != 2);
                    break;
                }
            }
            if (acceso) {
                intentos = 0;
                continue;
            }
            intentos++;
            cout << "\nUsuario y/o password incorrecta.\n";
            if (intentos == 3) {
                cout << "\nUsuario bloqueado. Contacte al administrador.\n";
            }
        }
        else if (opcionMenu == 7) {         // Crear cuenta
            string newUsername, newPassword;
            cout << "Ingrese el nombre de usuario para la nueva cuenta: ";
            cin >> newUsername;
            cout << "Ingrese la password para la nueva cuenta: ";
            cin >> newPassword;
            while (!validarPassword(newPassword)) {
                cout << "\nIngrese una password que cumpla con los requisitos: ";
                cin >> newPassword;
            }
            clients.push_back(Client(newUsername, newPassword));
            cout << "Cuenta creada exitosamente.\n";
        }
        else {
            cout << "Opción inválida. Vuelva a intentarlo.\n";
        }
    }

    return 0;
}
