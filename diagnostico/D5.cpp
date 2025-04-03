#include <iostream>
#include <string>

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
    Article(int id, string nombre, float precio, int stock) : id(id), nombre(nombre), precio(precio), stock(stock)  {}
    int getid() { return id; }
    string getNombre() { return nombre; }
    float getPrecio() { return precio; }
    int getStock() { return stock; }
};

bool validarPassword(const string& password) {
    if (password.length() < 8 || password.length() > 16) {
        cout << "\nLa contrasena debe tener entre 8 y 16 caracteres.\n";
        return false;
    }

    int mayusculas = 0, simbolos = 0;
    for (char c : password) {
        if (c >= 'A' && c <= 'Z') mayusculas++; // Verifica mayúsculas
        if (!( (c >= '0' && c <= '9') || (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') )) simbolos++; // Verifica símbolos
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
    Client clients[] = {
        Client("Aylen", "Aylen@1234"),
        Client("Gabi", "Gabi#0456"),
        Client("Silvi", "Silvi$0440")
    };

    Article articles[]={
        Article(1,"Lavandina x 1L",875.25,3000),
        Article(4,"Detergente x 500mL",1102.45,2010),
        Article(2,"Jabon en polvo x 250ML",650.22, 407)
    };

    string username, password;
    int intentos = 0;
    bool acceso = false;

    while (true) {
        int opcionMenu;

        cout << "\nMenu Principal:\n";
        cout << "1. Iniciar sesion\n";
        cout << "2. Crear cuenta de usuario\n";
        cout << "Ingrese la opcion deseada (1 o 2): ";
        cin >> opcionMenu;

        if (opcionMenu == 1) { 
            cout << "Ingrese su nombre de usuario: ";
            cin >> username;
            cout << "Ingrese su password: ";
            cin >> password;

            for (int i = 0; i < 3; i++) {
                if (clients[i].getUsername() == username && clients[i].getPassword() == password) {
                    cout << "Bienvenido/a " << username << "!" << endl;
                    acceso = true;

                    int opcion;

                    do {
                        cout << "\nMenu de opciones:\n";
                        cout << "1. Cambiar password\n";
                        cout << "2. Volver al login\n";
                        cout << "Ingrese la opcion deseada (1 o 2): ";
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
                        } else if (opcion == 2) {
                            cout << "\nVolviendo al login...\n" << endl;
                        } else {
                            cout << "\nOpcion invalida. Intente de nuevo.\n";
                        }
                    } while (opcion != 2); // 2 rompe el do-while

                    break; // Salir del loop de inicio de sesión
                }
            }

            if (acceso) {
                intentos = 0;
                continue;  // Evitar el "Usuario incorrecto"
            }

            intentos++;
            cout << "\nUsuario y/o password incorrecta.\n";
            if (intentos == 3) {
                cout << "\nUsuario bloqueado. Contacte al administrador." << endl;
            }

        } else if (opcionMenu == 2) { // Crear cuenta
            string newUsername, newPassword;
            cout << "Ingrese el nombre de usuario para la nueva cuenta: ";
            cin >> newUsername;
            cout << "Ingrese la password para la nueva cuenta: ";
            cin >> newPassword;

            while (!validarPassword(newPassword)) {
                cout << "\nIngrese una password que cumpla con los requisitos: ";
                cin >> newPassword;
            }

            
            cout << "Cuenta creada exitosamente.\n";
        } else {
            cout << "Opción inválida. Vuelva a intentarlo.\n";
        }
    }

    return 0;
}
