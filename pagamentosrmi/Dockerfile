# Usar uma imagem base com JDK e Maven instalados
FROM maven:3.8.6-openjdk-17 AS build

# Definir o diretório de trabalho dentro do container
WORKDIR /app

# Copiar o arquivo pom.xml para o diretório de trabalho
COPY pom.xml .

# Baixar as dependências do Maven
RUN mvn dependency:go-offline

# Copiar os arquivos de código-fonte para o diretório de trabalho
COPY src ./src

# Compilar o projeto e gerar o JAR
RUN mvn clean package -DskipTests

# Criar uma nova imagem base para executar o aplicativo
FROM openjdk:17-jdk-slim

# Definir o diretório de trabalho no container
WORKDIR /app

# Copiar o JAR compilado da fase anterior
COPY --from=build /app/target/pagamentosrmi-1.0-SNAPSHOT.jar app.jar

# Expor a porta 1099 (usada pelo RMI)
EXPOSE 1099

# Comando para iniciar o servidor RMI
ENTRYPOINT ["java", "-jar", "app.jar"]