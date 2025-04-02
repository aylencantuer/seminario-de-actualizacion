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

int main() {

    Client clients[] = {
        Client("Aylen", "1234"),
        Client("Gabi", "0456"),
        Client("Silvi", "0440"),
    };

    string username, password;
    int intentos = 0;
    bool acceso = false;

    while (intentos < 3) {
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
                        clients[i].setPassword(newPassword);
                        cout << "\nPassword cambiada exitosamente.\n";
                    } else if (opcion == 2) {
                        cout << "\n Volviendo al login...\n" << endl;
                    } else {
                        cout << "\n Opción inválida. Intente de nuevo.\n";
                    }
                } while (opcion != 2); // 2 rompe el do-while

              break; 
            }
        }

        if (acceso) {
            intentos = 0;
            continue;  //Evitar el "Usuario incorrecto"
        }

        intentos++;
        cout << "\nUsuario y/o password incorrecta.\n";
        if (intentos == 3) {
            cout << "\nUsuario bloqueado. Contacte al administrador." << endl;
        }
    }

    return 0;
}
