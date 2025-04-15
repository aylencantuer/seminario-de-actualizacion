#include <iostream>
#include <string>
#include <vector>

using namespace std;

class User {
protected:
    string username;
    string password;
public:
    User(string u, string p) : username(u), password(p) {}
    virtual string getUsername() = 0;
    virtual string getPassword() = 0;
    virtual void setPassword(string newPassword) = 0;

    // Métodos virtuales x permisos
    virtual bool canCreateArticle() = 0;
    virtual bool canEditArticle() = 0;
    virtual bool canDeleteArticle() = 0;
    virtual bool canBuyArticle() = 0;
    virtual bool canManageUsers() = 0;

    virtual ~User() {}
};

class Client : public User {
public:
    Client(string u, string p) : User(u, p) {}
    string getUsername() override { return username; }
    string getPassword() override { return password; }
    void setPassword(string newPassword) override { password = newPassword; }

    bool canCreateArticle() override { return false; }
    bool canEditArticle() override { return false; }
    bool canDeleteArticle() override { return false; }
    bool canBuyArticle() override { return true; }
    bool canManageUsers() override { return false; }
};

class Seller : public User {
public:
    Seller(string u, string p) : User(u, p) {}
    string getUsername() override { return username; }
    string getPassword() override { return password; }
    void setPassword(string newPassword) override { password = newPassword; }

    bool canCreateArticle() override { return true; }
    bool canEditArticle() override { return true; }
    bool canDeleteArticle() override { return false; }
    bool canBuyArticle() override { return false; }
    bool canManageUsers() override { return false; }
};

class WarehouseEmployee : public User {
public:
    WarehouseEmployee(string u, string p) : User(u, p) {}
    string getUsername() override { return username; }
    string getPassword() override { return password; }
    void setPassword(string newPassword) override { password = newPassword; }

    bool canCreateArticle() override { return false; }
    bool canEditArticle() override { return true; }
    bool canDeleteArticle() override { return true; }
    bool canBuyArticle() override { return false; }
    bool canManageUsers() override { return false; }
};

class Manager : public User {
public:
    Manager(string u, string p) : User(u, p) {}
    string getUsername() override { return username; }
    string getPassword() override { return password; }
    void setPassword(string newPassword) override { password = newPassword; }

    bool canCreateArticle() override { return true; }
    bool canEditArticle() override { return true; }
    bool canDeleteArticle() override { return true; }
    bool canBuyArticle() override { return false; }
    bool canManageUsers() override { return true; }
};

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

bool validatePassword(const string& password) {
    if (password.length() < 8 || password.length() > 16) {
        cout << "La contraseña debe tener entre 8 y 16 caracteres.\n";
        return false;
    }
    int upper = 0, symbols = 0;
    for (char c : password) {
        if (isupper(c)) upper++;
        if (!isalnum(c)) symbols++;
    }
    if (upper < 1) {
        cout << "La contraseña debe tener al menos una mayuscula.\n";
        return false;
    }
    if (symbols < 2) {
        cout << "La contraseña debe tener al menos dos simbolos especiales.\n";
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
        Article(3, "Detergente x 500mL", 1102.45, 2010)
    };

    string username, password;

    while (true) {
        cout << "\nMenu Principal:\n1. Iniciar sesion\n2. Salir\nOpcion: ";
        int option;
        cin >> option;

        if (option == 1) {
            cout << "Usuario: ";
            cin >> username;
            cout << "Password: ";
            cin >> password;

            User* activeUser = nullptr;

            for (auto* user : users) {
                if (user->getUsername() == username && user->getPassword() == password) {
                    activeUser = user;
                    break;
                }
            }

            if (!activeUser) {
                cout << "Usuario o contraseña incorrectos.\n";
                continue;
            }

            int action;
            do {
                cout << "\n--- Menu Principal ---\n";
                cout << "1. Listar articulos\n";
                if (activeUser->canCreateArticle()) cout << "2. Crear articulo\n";
                if (activeUser->canEditArticle())   cout << "3. Editar articulo\n";
                if (activeUser->canDeleteArticle()) cout << "4. Eliminar articulo\n";
                if (activeUser->canBuyArticle())    cout << "5. Comprar articulo\n";
                if (activeUser->canManageUsers())   cout << "6. Gestionar cuentas de usuario\n";
                cout << "7. Volver al menu principal\nOpcion: ";
                cin >> action;

                if (action == 1) {
                    for (auto& a : articles) {
                        cout << "ID: " << a.getId()
                             << " | Nombre: " << a.getName()
                             << " | Precio: $" << a.getPrice()
                             << " | Stock: " << a.getStock() << endl;
                    }
                }
                else if (action == 2 && activeUser->canCreateArticle()) {
                    int id, stock;
                    float price;
                    string name;
                    cout << "ID: "; cin >> id;
                    cout << "Nombre: "; cin.ignore(); getline(cin, name);
                    cout << "Precio: "; cin >> price;
                    cout << "Stock: "; cin >> stock;
                    articles.push_back(Article(id, name, price, stock));
                    cout << "Articulo creado con éxito.\n";
                }
                else if (action == 3 && activeUser->canEditArticle()) {
                    int id;
                    cout << "ID del articulo a editar: ";
                    cin >> id;
                    for (auto& a : articles) {
                        if (a.getId() == id) {
                            string name;
                            float price;
                            int stock;
                            cout << "Nuevo nombre: "; cin.ignore(); getline(cin, name);
                            cout << "Nuevo precio: "; cin >> price;
                            cout << "Nuevo stock: "; cin >> stock;
                            a.setName(name);
                            a.setPrice(price);
                            a.setStock(stock);
                            cout << "Articulo actualizado.\n";
                            break;
                        }
                    }
                }
                else if (action == 4 && activeUser->canDeleteArticle()) {
                    int id;
                    cout << "ID del articulo a eliminar: ";
                    cin >> id;
                    for (auto it = articles.begin(); it != articles.end(); ++it) {
                        if (it->getId() == id) {
                            articles.erase(it);
                            cout << "Articulo eliminado.\n";
                            break;
                        }
                    }
                }
                else if (action == 5 && activeUser->canBuyArticle()) {
                    int id, quantity;
                    cout << "ID del articulo a comprar: ";
                    cin >> id;
                    for (auto& a : articles) {
                        if (a.getId() == id) {
                            cout << "Cantidad: ";
                            cin >> quantity;
                            if (quantity <= a.getStock()) {
                                a.setStock(a.getStock() - quantity);
                                cout << "Compra exitosa.\n";
                            } else {
                                cout << "Stock insuficiente.\n";
                            }
                            break;
                        }
                    }
                }
                else if (action == 6 && activeUser->canManageUsers()) {
                    // Submenu para administrar usuarios
                    cout << "\n--- Gestion de Cuentas ---\n";
                    cout << "1. Crear nuevo usuario\nOpcion: ";
                    int opc;
                    cin >> opc;
                    if (opc == 1) {
                        string newUser, newPass;
                        int type;
                        cout << "Nombre de usuario: ";
                        cin >> newUser;
                        cout << "Password: ";
                        cin >> newPass;
                        while (!validatePassword(newPass)) {
                            cout << "Reingrese password: ";
                            cin >> newPass;
                        }
                        cout << "Tipo (1=Cliente, 2=Vendedor, 3=Deposito, 4=Administrador): ";
                        cin >> type;

                        if (type == 1)
                            users.push_back(new Client(newUser, newPass));
                        else if (type == 2)
                            users.push_back(new Seller(newUser, newPass));
                        else if (type == 3)
                            users.push_back(new WarehouseEmployee(newUser, newPass));
                        else if (type == 4)
                            users.push_back(new Manager(newUser, newPass));
                        else
                            cout << "Tipo invalido.\n";
                        cout << "Usuario creado.\n";
                    }
                }
                else if (action == 7) {
                    cout << "Volviendo al menu principal...\n";
                }
                else {
                    cout << "Opcion invalida o no autorizada.\n";
                }

            } while (action != 7);
        }
        else if (option == 2) {
            cout << "Saliendo del sistema.\n";
            break;
        }
        else {
            cout << "Opcion invalida.\n";
        }
    }

    // Limpieza 
    for (auto* user : users) delete user;

    return 0;
}
