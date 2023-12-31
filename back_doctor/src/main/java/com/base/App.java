package com.base;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@MapperScan(value = {"com.base.mapper", "com.base.tomapper"})
@EnableTransactionManagement
public class App {

    public static void main(String[] args) {

          SpringApplication.run(App.class, args);
    }

}
