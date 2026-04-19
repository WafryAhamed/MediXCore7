package com.bchospital.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.TransactionManager;
import org.web3j.tx.RawTransactionManager;

@Configuration
public class Web3jConfig {

    @Value("${web3j.client-address}")
    private String clientAddress;

    @Bean
    public Web3j web3j() {
        return Web3j.build(new HttpService(clientAddress));
    }

    @Bean
    public Credentials credentials() {
        // In a real scenario, this would be securely loaded from a vault or secure environment variable.
        // Returning a dummy for initialization purposes.
        return Credentials.create("0x0000000000000000000000000000000000000000000000000000000000000001");
    }

    @Bean
    public TransactionManager transactionManager(Web3j web3j, Credentials credentials) {
        long chainId = 1337; // Standard local dev chain ID, adjust per environment
        return new RawTransactionManager(web3j, credentials, chainId);
    }
}
