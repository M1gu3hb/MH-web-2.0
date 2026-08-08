/**
 * El monograma, reducido a caracteres.
 *
 * Se genera una sola vez a partir del PNG del logo —recortado a su contenido y
 * remuestreado a una rejilla cuya proporción es la de un glifo monoespaciado,
 * para que no salga achatado— y se guarda aquí ya resuelto: la pantalla de
 * carga es lo primero que se ve, y no puede depender de descargar una imagen
 * ni de medir nada para empezar a pintar.
 *
 * La densidad de cada celda sale del canal alfa, no del brillo. Con el brillo
 * salía otro dibujo: seis de cada diez píxeles del monograma son casi negros
 * —la M y la H— y se quedaban en blanco, así que solo sobrevivía el aro. Lo
 * que se formaba era un círculo ancho que no se reconocía como el logo. Con el
 * alfa, lo que se dibuja es el trazo, que es de lo que está hecha la marca.
 *
 * Cada carácter marca cuánta tinta hay en esa celda, del espacio a la arroba.
 */
export const LOGO_ASCII = [
  "                     :-=+*##%#%%##*+=-",
  "                 :=#@@@@@@@@@@@@@@@@@@@%*-",
  "              :+%@@@@@@@@@@@@@@@@@@@@@@@@@@*:        .---:",
  "            -#@@@@@@@@@@@%#******#%@@@@@@@@@@%-      +@@@*",
  "          :%@@@@@@@@@*=:            -+%@@@@@@@+      +@@@*",
  "         *@@@@@@@@*-                   .+%@@%-  :####=---.",
  "       :%@@@@@@%=                         -=    -@@@@=   ..",
  "       -@@@@@@+                                 -@@@@= +@@@*",
  "     =*..*@@#:                      +-           ----  *@@@*",
  "    +@@@+.:=                      =%@=       :======   -***-",
  "   =@@@@@@=                     :#@@@=       =@@@@@@  .",
  "  :@@@@@@@@#:                 :*@@@@@=       =@@@@@@ .@*",
  "  #@@@@@@@@@@*.              +@@@@@@@=       =@@@@@@ .@@*",
  " -@@@@@@@@@@@@@+           =@@@@@@@@@=       =@@@@@@ .@@@=",
  " #@@@@@#%@@@@@@@%-       -#@@@@@@@@@@=       =@@@@@@ .@@@@:",
  " @@@@@@. =@@@@@@@@#:   :#@@@@@@@@@@@@=       =@@@@@@ .@@@@*",
  "-@@@@@#   .*@@@@@@@@*:*@@@@@@@@%@@@@@=       =@@@@@@ .@@@@@",
  "+@@@@@+     -#@@@@@@@@@@@@@@@*.*@@@@@=       =@@@@@@ .@@@@@-",
  "*@@@@@=       =@@@@@@@@@@@@%:  *@@@@@=       =@@@@@@ .@@@@@=",
  "*@@@@@=         *@@@@@@@@@=    *@@@@@=   :=*%@@@@@@@ .@@@@@+",
  "*@@@@@=          :#@@@@@*.     *@@@@@*+#@@@@@@@@@@@@ .@@@@@=",
  "=@@@@@+            =@@#:       *@@@@@@@@@@@@@@@@@@@@ .@@@@@-",
  ":@@@@@#             .-         *@@@@@@@@@@@@@%@@@@@@  @@@@@",
  " %@@@@@:                       *@@@@@@@@@#+: -@@@@@@  @@@@*",
  " +@@@@@#                       *@@@@@%+:     -@@@@@@  @@@@-",
  "  @@@@@@+                      *@@@@@+       -@@@@@@  @@@*",
  "  -@@@@@@=                     *@@@@@+       -@@@@@@  @@%",
  "   +@@@@@@=                    *@@@@@+       -@@@@@@  @@:",
  "    #@@@@@@*                   *@@@@@+       -@@@@@@. %:",
  "     *@@@@@@%-                 *@@@@@+       -@@@@@@:",
  "      +@@@@@@@#:               *@@@@@+       -@@@@@@:",
  "       -%@@@@@@@#-             *@@@@@+       -@@@@@#",
  "         +@@@@@@@@%+-          *@@@@@+       -@@@@=",
  "          :#@@@@@@@@@@#+-.     *@@@@@+       -@@#:",
  "            -*@@@@@@@@@@@@@%%+ *@@@@@+       -*-",
  "              .=#@@@@@@@@@@@@* *@@@@@+",
  "                  -*%@@@@@@@@* *@@@@@=",
  "                      :-+**##+ +#*+=:",
].join('\n');

export const ASCII_COLS = 60;
export const ASCII_ROWS = 38;
