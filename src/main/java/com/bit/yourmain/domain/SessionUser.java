package com.bit.yourmain.domain;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Setter
@Getter
public class SessionUser implements Serializable {

    private final Long no;
    private String name;
    private String id;
    private String phone;
    private String address;
    private String detailAddress;
    private String profile;
    private Role role;
    private final String password;

    public SessionUser(Users users) {
        this.no = users.getNo();
        this.name = users.getName();
        this.id = users.getId();
        this.phone = users.getPhone();
        this.address = users.getAddress();
        this.detailAddress = users.getDetailAddress();
        this.profile = users.getProfile();
        this.role = users.getRole();
        this.password = users.getPassword();
    }
}
