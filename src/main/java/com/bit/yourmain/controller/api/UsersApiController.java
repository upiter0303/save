package com.bit.yourmain.controller.api;

import com.bit.yourmain.domain.users.SessionUser;
import com.bit.yourmain.domain.users.Users;
import com.bit.yourmain.dto.users.PasswordModifyDto;
import com.bit.yourmain.dto.users.UserModifyDto;
import com.bit.yourmain.dto.users.UserSaveRequestDto;
import com.bit.yourmain.service.UsersService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.*;

@RestController
@RequiredArgsConstructor
public class UsersApiController {
    private final UsersService usersService;

    @PostMapping("/signup")
    public void save(@RequestBody UserSaveRequestDto users, HttpSession session) {
        session.removeAttribute("emailCodeInfo");
        String pass = (String) session.getAttribute("emailPass");
        usersService.save(users, pass);
        session.removeAttribute("emailPass");
    }

    @PostMapping("/idCheck")
    public Object idCheck(@RequestBody UserSaveRequestDto users) {
        Users checkUser = null;
        try {
            checkUser = usersService.getUsers(users.getId());
        } catch (NoSuchElementException e) {
            System.out.println("가입된 계정 없음");
        }

        boolean check;
        check = checkUser == null;

        Map<String, Object> map = new HashMap<>();
        map.put("result", "success");
        map.put("data", check);
        return map;
    }

    @PostMapping("/userModify")
    public void userModify(@RequestBody UserModifyDto modifyDto, HttpSession session) {
        SessionUser sessionUser = (SessionUser) session.getAttribute("userInfo");
        sessionUser = usersService.userModify(modifyDto, sessionUser);
        session.removeAttribute("userInfo");
        session.setAttribute("userInfo" , sessionUser);
    }


    @PostMapping("/passwordModify")
    public void passwordModify(@RequestBody PasswordModifyDto modifyDto) {
        usersService.passwordModify(modifyDto);
    }

    @GetMapping("/leave/{id}")
    public void leave(@PathVariable String id) {
        usersService.leave(id);
    }

    @PostMapping("/findIdByEmail")
    public String findIdByEmail(@RequestBody Map<String,String> map) {
        return usersService.findByEmail(map.get("email")).getId();
    }

    @PostMapping("/findEmailById")
    public String findEmailById(@RequestBody Map<String,String> map) {
        return usersService.getUsers(map.get("id")).getEmail();
    }
}
