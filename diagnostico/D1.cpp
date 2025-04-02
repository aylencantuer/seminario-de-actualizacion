#include <iostream>
#include <string>

using namespace std;


class Client
{
private:
string username;
string password;
public:
Client(string u, string p) : username(u), password(p) {}
string getUsername() { return username; }
string getPassword() { return password; }
};

int main ()
{

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
        cout << "Ingrese su contraseña: ";
        cin >> password;


        for (int i = 0; i < 3; i++) {
            if (clients[i].getUsername() == username && clients[i].getPassword() == password) {
                cout << "¡Bienvenido/a " << username << "!" << endl;
                acceso = true;
                break;
            }
        }

        if (acceso) break;
        intentos++;
        cout << "Usuario y/o contraseña incorrecta." << endl;

        if (intentos == 3) {
            cout << "Usuario bloqueado. Contacte al administrador." << endl;
        }
    }

    return 0;
}