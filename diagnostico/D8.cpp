#include <iostream>
#include <string>
#include <vector>

using namespace std;

class User {
    public:
        virtual string getUsername() const = 0;
        virtual string getPassword() const = 0;
        virtual void setPassword(const string& newPassword) = 0;
        virtual ~User() {}
    };


class Client : public User {
    private:
        string username, password;
    public:
        Client(const string& u, const string& p) : username(u), password(p) {}
        string getUsername() const override { return username; }
        string getPassword() const override { return password; }
        void setPassword(const string& newPassword) override { password = newPassword; }
    };
    
    class Manager : public User {
    private:
        string username, password;
    public:
        Manager(const string& u, const string& p) : username(u), password(p) {}
        string getUsername() const override { return username; }
        string getPassword() const override { return password; }
        void setPassword(const string& newPassword) override { password = newPassword; }
    };
    
    class Seller : public User {
    private:
        string username, password;
    public:
        Seller(const string& u, const string& p) : username(u), password(p) {}
        string getUsername() const override { return username; }
        string getPassword() const override { return password; }
        void setPassword(const string& newPassword) override { password = newPassword; }
    };
    
    class WarehouseEmployee : public User {
    private:
        string username, password;
    public:
        WarehouseEmployee(const string& u, const string& p) : username(u), password(p) {}
        string getUsername() const override { return username; }
        string getPassword() const override { return password; }
        void setPassword(const string& newPassword) override { password = newPassword; }
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

    vector<User*> users;
    users.push_back(new Client("cliente1",           "Cli@1234!"));
    users.push_back(new Manager("admin1",            "Adm!!n123"));
    users.push_back(new Seller("vendedor1",          "Vend@5678"));
    users.push_back(new WarehouseEmployee("repo1",    "Depo#9012"));


    vector<Article> articles = {
        Article(1, "Lavandina x 1L",     875.25, 3000),
        Article(4, "Detergente x 500mL",1102.45, 2010),
        Article(2, "Jabon en polvo x 250ML",650.22, 407)
    };

    string username, password;

    while (true) {
        int opcionMenu;
        cout << "\nMenu Principal:\n"
             << "1. Iniciar sesion\n"
             << "2. Crear cuenta de usuario\n"
             << "Ingrese el numero de la opcion deseada: ";
        cin >> opcionMenu;

        if (opcionMenu == 1) {  // Iniciar sesión
            cout << "Ingrese su nombre de usuario: ";
            cin >> username;
            cout << "Ingrese su password: ";
            cin >> password;

            bool acceso = false;
            User* usuarioLogeado = nullptr;
            for (auto u : users) {
                if (u->getUsername() == username && u->getPassword() == password) {
                    acceso = true;
                    usuarioLogeado = u;
                    break;
                }
            }

            if (acceso) {
                cout << "Bienvenido/a " << usuarioLogeado->getUsername() << "!\n";


                int opcionSub;
                do {
                    cout << "\n--- Menu de Usuario ---\n"
                         << "1. Listar Articulos\n"
                         << "2. Nuevo Articulo\n"
                         << "3. Editar Articulo\n"
                         << "4. Eliminar Articulo\n"
                         << "5. Comprar Articulo\n"
                         << "6. Volver al menu principal\n"
                         << "Ingrese su opcion: ";
                    cin >> opcionSub;

                    if (opcionSub == 1) {
                        cout << "\nListado de Artículos:\n";
                        for (auto& art : articles) {
                            cout << "ID: " << art.getid()
                                 << " | Nombre: " << art.getNombre()
                                 << " | Precio: $" << art.getPrecio()
                                 << " | Stock: " << art.getStock()
                                 << endl;
                        }
                    }
                    else if (opcionSub == 2) {
                        int id, stock; float precio; string nombre;
                        cout << "\nIngrese ID del nuevo artículo: ";
                        cin >> id;
                        bool existe = false;
                        for (auto& art : articles)
                            if (art.getid() == id) { existe = true; break; }
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
                    else if (opcionSub == 3) {
                        int id; cout << "\nIngrese ID del artículo a editar: ";
                        cin >> id;
                        bool encontrado = false;
                        for (auto& art : articles) {
                            if (art.getid() == id) {
                                string nn; float np; int ns;
                                cout << "Nuevo nombre: ";
                                cin.ignore();
                                getline(cin, nn);
                                cout << "Nuevo precio: ";
                                cin >> np;
                                cout << "Nuevo stock: ";
                                cin >> ns;
                                art.setNombre(nn);
                                art.setPrecio(np);
                                art.setStock(ns);
                                cout << "Artículo actualizado correctamente.\n";
                                encontrado = true;
                                break;
                            }
                        }
                        if (!encontrado)
                            cout << "No se encontró el artículo con ese ID.\n";
                    }
                    else if (opcionSub == 4) {
                        int id; cout << "\nIngrese ID del artículo a eliminar: ";
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
                        if (!eliminado)
                            cout << "No se encontró el artículo con ese ID.\n";
                    }
                    else if (opcionSub == 5) {
                        int idC, cant; bool found = false;
                        cout << "\n--- Comprar Artículo ---\n";
                        for (auto& art : articles) {
                            cout << "ID: " << art.getid()
                                 << " | Nombre: " << art.getNombre()
                                 << " | Precio: $" << art.getPrecio()
                                 << " | Stock: " << art.getStock() << endl;
                        }
                        cout << "\nID a comprar: ";
                        cin >> idC;
                        for (auto& art : articles) {
                            if (art.getid() == idC) {
                                found = true;
                                if (art.getStock() <= 0) {
                                    cout << "Sin stock disponible.\n";
                                    break;
                                }
                                cout << "Cantidad: ";
                                cin >> cant;
                                if (cant <= 0) {
                                    cout << "Cantidad invalida.\n";
                                    break;
                                }
                                if (cant > art.getStock()) {
                                    cout << "Stock insuficiente (" << art.getStock() << ").\n";
                                    break;
                                }
                                art.setStock(art.getStock() - cant);
                                cout << "Compra realizada con éxito. ¡Gracias por su compra!\n";
                                break;
                            }
                        }
                        if (!found)
                            cout << "No existe artículo con ese ID.\n";
                    }
                    else if (opcionSub == 6) {
                        cout << "\nVolviendo al menu principal...\n";
                    }
                    else {
                        cout << "Opción inválida. Intente nuevamente.\n";
                    }
                } while (opcionSub != 6);
            }
            else {
                cout << "\nUsuario y/o password incorrecta.\n";
            }
        }
        else if (opcionMenu == 2) {  // Crear cuenta
            string nu, np;
            int tipo;
            cout << "\nSeleccione tipo de usuario:\n"
                 << "1. Cliente\n"
                 << "2. Administrador\n"
                 << "3. Vendedor\n"
                 << "4. Deposito\n"
                 << "Ingrese (1-4): ";
            cin >> tipo;
            cout << "Ingrese nombre de usuario: ";
            cin >> nu;
            cout << "Ingrese password: ";
            cin >> np;
            while (!validarPassword(np)) {
                cout << "\nIngrese una password válida: ";
                cin >> np;
            }
            if (tipo == 1)       users.push_back(new Client(nu, np));
            else if (tipo == 2)  users.push_back(new Manager(nu, np));
            else if (tipo == 3)  users.push_back(new Seller(nu, np));
            else if (tipo == 4)  users.push_back(new WarehouseEmployee(nu, np));
            cout << "Cuenta creada exitosamente.\n";
        }
        else {
            cout << "Opción inválida. Vuelva a intentarlo.\n";
        }
    }

    return 0;
}