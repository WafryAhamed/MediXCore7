# BC Hospital API

This is the backend server for the BC Hospital Management System.
It is built with Java 21, Spring Boot 3.2.x, PostgreSQL, and integrates with a Hyperledger Besu local node using web3j.

## Stack
- **Java 21 LTS**
- **Spring Boot 3.2.x**
- **Spring Security** (Stateless JWT)
- **Spring Data JPA & Hibernate**
- **PostgreSQL 16** (with Flyway database migrations)
- **Web3j** (Hyperledger Besu integration)
- **MapStruct & Lombok**
- **Springdoc** (OpenAPI UI)
- **WebSocket / STOMP**
- **Testcontainers & JUnit 5**

## Getting Started

1. Ensure PostgreSQL is running.
2. Initialize environment variables directly, or map `.env.example` into your environment variables.
3. Run `mvn spring-boot:run`.

Migrations will execute automatically via Flyway.
