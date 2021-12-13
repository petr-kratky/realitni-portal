# Realitní Portál
Zdrojový kód (ZK) je dělen na dvě části - backend najdete ve složce `reality-apollo-server` a frontend ve složce `reality-frontend`. Tyto dva servery se spouští zvlášť, ale pro funkční řešení je zapotřebí mít zapnuté oba.

V obou složkách najdete soubor `Dockerfile`, který slouží pro kompilaci aplikací do Docker obrazů a následné spuštění v jakékoliv kontejnerové orchestrační platformě.

V kořenovém adresáři najdete také soubor pojmenovaný `build.sh`, který slouží právě pro kompilaci Docker obrazů. Skript jako argument vyžaduje absolutní cestu ke kořenové složce ZK.

Při spouštění nezapomeňtě specifikovat všechny proměnné prostředí specifikované v souborech pojmenovaných `.env.template`, které naleznete v obou složkách.

V případě problémů nebo otázek se prosím obraťe na autora - Petr Krátký: kratky.pete@gmail.com.