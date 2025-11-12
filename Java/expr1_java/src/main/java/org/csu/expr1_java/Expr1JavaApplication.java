package org.csu.expr1_java;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("org.csu.expr1_java.persistence")
public class Expr1JavaApplication {

    public static void main(String[] args) {
        SpringApplication.run(Expr1JavaApplication.class, args);
    }

}
