#include <iostream>
#include <string>
#include <vector>

using namespace std;

class User {
public:
    virtual string getUsername() = 0;
    virtual string getPassword() = 0;
    
    // Métodos virtuales de permisos
    virtual bool canListArticles() = 0;
    virtual bool canCreateArticle() = 0;
    virtual bool canEditArticle() = 0;
    virtual bool canDeleteArticle() = 0;
    virtual bool canBuyArticle() = 0;

    virtual ~User() {}  
};

// Cliente (puede comprar, pero no modificar artículos)
class Client : public User {
private:
    string username;
    string password;
public:
    Client(string u, string p) : username(u), password(p) {}
    string getUsername() override { return username; }
    string getPassword() override { return password; }

    bool canListArticles() override { return true; }
    bool canCreateArticle() override { return false; }
    bool canEditArticle() override { return false; }
    bool canDeleteArticle() override { return false; }
    bool canBuyArticle() override { return true; }
};

// Manager (puede hacer todo)
class Manager : public User {
private:
    string username;
    string password;
public:
    Manager(string u, string p) : username(u), password(p) {}
    string getUsername() override { return username; }
    string getPassword() override { return password; }

    bool canListArticles() override { return true; }
    bool canCreateArticle() override { return true; }
    bool canEditArticle() override { return true; }
    bool canDeleteArticle() override { return true; }
    bool canBuyArticle() override { return true; }
};

// Vendedor (puede listar y vender artículos)
class Seller : public User {
private:
    string username;
    string password;
public:
    Seller(string u, string p) : username(u), password(p) {}
    string getUsername() override { return username; }
    string getPassword() override { return password; }

    bool canListArticles() override { return true; }
    bool canCreateArticle() override { return false; }
    bool canEditArticle() override { return false; }
    bool canDeleteArticle() override { return false; }
    bool canBuyArticle() override { return true; }
};

// Empleado de depósito (puede listar, crear, editar y eliminar, pero no comprar)
class WarehouseEmployee : public User {
private:
    string username;
    string password;
public:
    WarehouseEmployee(string u, string p) : username(u), password(p) {}
    string getUsername() override { return username; }
    string getPassword() override { return password; }

    bool canListArticles() override { return true; }
    bool canCreateArticle() override { return true; }
    bool canEditArticle() override { return true; }
    bool canDeleteArticle() override { return true; }
    bool canBuyArticle() override { return false; }
};

// Clase artículo
class Article {
private:
    int id;
    string name;
    float price;
    int stock;
public:
    Article(int id, string name, float price, int stock)
        : id(id), name(name), price(price), stock(stock) {}

    int getId() { return id; }
    string getName() { return name; }
    float getPrice() { return price; }
    int getStock() { return stock; }

    void setName(string newName) { name = newName; }
    void setPrice(float newPrice) { price = newPrice; }
    void setStock(int newStock) { stock = newStock; }
};

// Función para validar contraseñas
bool validatePassword(const string& password) {
    if (password.length() < 8 || password.length() > 16) {
        cout << "\nLa contraseña debe tener entre 8 y 16 caracteres.\n";
        return false;
    }
    int uppercase = 0, symbols = 0;
    for (char c : password) {
        if (c >= 'A' && c <= 'Z') uppercase++;
        if (!isalnum(c)) symbols++;
    }
    if (uppercase < 1) {
        cout << "\nLa contraseña debe tener al menos una letra mayúscula.\n";
        return false;
    }
    if (symbols < 2) {
        cout << "\nLa contraseña debe tener al menos dos símbolos especiales.\n";
        return false;
    }
    return true;
}

int main() {
    vector<User*> users = {
        new Client("aylen", "Aylen@1234"),
        new Seller("gabi", "Gabi@0456"),
        new Manager("silvi", "Silvi@0440"),
        new WarehouseEmployee("martin", "Marti@2244")
    };

    vector<Article> articles = {
        Article(1, "Lavandina x 1L", 875.25, 3000),
        Article(2, "Jabon en polvo x 250ML", 650.22, 407),
        Article(4, "Detergente x 500mL", 1102.45, 2010)
    };

    string username, password;
    User* activeUser = nullptr; // Puntero al usuario actualmente logueado

    while (true) {
        int menuOption;
        cout << "\n--- Menu Principal ---\n"
             << "1. Iniciar sesión\n"
             << "2. Crear cuenta de cliente\n"
             << "Ingrese opción: ";
        cin >> menuOption;

        if (menuOption == 1) {
            cout << "Usuario: ";
            cin >> username;
            cout << "Password: ";
            cin >> password;

            activeUser = nullptr;
            for (auto user : users) {
                if (user->getUsername() == username && user->getPassword() == password) {
                    activeUser = user;
                    break;
                }
            }

            if (activeUser != nullptr) {
                cout << "\nBienvenido/a " << activeUser->getUsername() << "!\n";
                int subOption;
                do {
                    cout << "\n--- Menu de Usuario ---\n"
                         << "1. Listar artículos\n"
                         << "2. Nuevo artículo\n"
                         << "3. Editar artículo\n"
                         << "4. Eliminar artículo\n"
                         << "5. Comprar artículo\n"
                         << "6. Cerrar sesión\n"
                         << "Ingrese opción: ";
                    cin >> subOption;

                    if (subOption == 1) {
                        if (activeUser->canListArticles()) {
                            cout << "\nListado de artículos:\n";
                            for (auto& article : articles) {
                                cout << "ID: " << article.getId()
                                     << " | Nombre: " << article.getName()
                                     << " | Precio: $" << article.getPrice()
                                     << " | Stock: " << article.getStock() << "\n";
                            }
                        } else {
                            cout << "No tiene permisos para listar artículos.\n";
                        }
                    } else if (subOption == 2) {
                        if (activeUser->canCreateArticle()) {
                            int id, stock;
                            float price;
                            string name;

                            cout << "\nID: ";
                            cin >> id;

                            bool exists = false;
                            for (auto& article : articles) {
                                if (article.getId() == id) {
                                    exists = true;
                                    break;
                                }
                            }
                            if (exists) {
                                cout << "Ya existe un artículo con ese ID.\n";
                            } else {
                                cout << "Nombre: ";
                                cin.ignore();
                                getline(cin, name);
                                cout << "Precio: ";
                                cin >> price;
                                cout << "Stock: ";
                                cin >> stock;

                                articles.push_back(Article(id, name, price, stock));
                                cout << "Artículo creado.\n";
                            }
                        } else {
                            cout << "No tiene permisos para crear artículos.\n";
                        }
                    } else if (subOption == 3) {
                        if (activeUser->canEditArticle()) {
                            int id;
                            cout << "\nID del artículo a editar: ";
                            cin >> id;

                            bool found = false;
                            for (auto& article : articles) {
                                if (article.getId() == id) {
                                    string newName;
                                    float newPrice;
                                    int newStock;

                                    cout << "Nuevo nombre: ";
                                    cin.ignore();
                                    getline(cin, newName);
                                    cout << "Nuevo precio: ";
                                    cin >> newPrice;
                                    cout << "Nuevo stock: ";
                                    cin >> newStock;

                                    article.setName(newName);
                                    article.setPrice(newPrice);
                                    article.setStock(newStock);

                                    cout << "Artículo actualizado.\n";
                                    found = true;
                                    break;
                                }
                            }
                            if (!found) cout << "No se encontró el artículo.\n";
                        } else {
                            cout << "No tiene permisos para editar artículos.\n";
                        }
                    } else if (subOption == 4) {
                        if (activeUser->canDeleteArticle()) {
                            int id;
                            cout << "\nID del artículo a eliminar: ";
                            cin >> id;

                            bool deleted = false;
                            for (auto it = articles.begin(); it != articles.end(); ++it) {
                                if (it->getId() == id) {
                                    articles.erase(it);
                                    cout << "Artículo eliminado.\n";
                                    deleted = true;
                                    break;
                                }
                            }
                            if (!deleted) cout << "No se encontró el artículo.\n";
                        } else {
                            cout << "No tiene permisos para eliminar artículos.\n";
                        }
                    } else if (subOption == 5) {
                        if (activeUser->canBuyArticle()) {
                            int id, quantity;
                            cout << "\nID del artículo a comprar: ";
                            cin >> id;

                            bool found = false;
                            for (auto& article : articles) {
                                if (article.getId() == id) {
                                    found = true;

                                    if (article.getStock() <= 0) {
                                        cout << "Sin stock disponible.\n";
                                        break;
                                    }

                                    cout << "Cantidad a comprar: ";
                                    cin >> quantity;

                                    if (quantity <= 0 || quantity > article.getStock()) {
                                        cout << "Cantidad inválida. Stock actual: " << article.getStock() << "\n";
                                        break;
                                    }

                                    article.setStock(article.getStock() - quantity);
                                    cout << "Compra realizada. Gracias!\n";
                                    break;
                                }
                            }
                            if (!found) cout << "Artículo no encontrado.\n";
                        } else {
                            cout << "No tiene permisos para comprar artículos.\n";
                        }
                    } else if (subOption == 6) {
                        cout << "Sesión finalizada.\n";
                        activeUser = nullptr;
                    } else {
                        cout << "Opción inválida.\n";
                    }
                } while (subOption != 6);
            } else {
                cout << "Usuario o contraseña incorrectos.\n";
            }
        } else if (menuOption == 2) {
            // Solo permite crear usuarios del tipo Cliente
            string newUsername, newPassword;
            cout << "\nNuevo CLiente: ";
            cin >> newUsername;
            cout << "Nueva password: ";
            cin >> newPassword;
            while (!validatePassword(newPassword)) {
                cout << "Intente nuevamente: ";
                cin >> newPassword;
            }
            users.push_back(new Client(newUsername, newPassword));
            cout << "Cuenta creada.\n";
        } else {
            cout << "Opción inválida.\n";
        }
    }

    return 0;
}
