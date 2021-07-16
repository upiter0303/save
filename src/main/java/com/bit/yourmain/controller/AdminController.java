package com.bit.yourmain.controller;

import com.bit.yourmain.dto.admin.UsersResponseDto;
import com.bit.yourmain.dto.posts.PostsResponseDto;
import com.bit.yourmain.service.AdminService;
import com.bit.yourmain.service.PostsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.bit.yourmain.controller.MainController.indexPage;

@RequiredArgsConstructor
@Controller
public class AdminController {

    private final AdminService adminService;
    private final PostsService postsService;

    @GetMapping("/adminPage")
    public String admin(Model model) {
        final Long cursor = 0L;
        List<PostsResponseDto> postsList = postsService.findAllDesc(indexPage, cursor);
        model.addAttribute("posts", postsList);
        List<UsersResponseDto> usersResponseDtoList = adminService.getResponseDtoList(indexPage);
        model.addAttribute("allUsers", usersResponseDtoList);
        int page = usersResponseDtoList.size() / 8 + 1;
        model.addAttribute("page", page);

        return "admin/adminPage";
    }

    @GetMapping("/adminPage/users/modify/{no}")
    public String modify(@PathVariable Long no, Model model) {
        UsersResponseDto dto = adminService.findByNo(no);
        model.addAttribute("user", dto);
        return "admin/usersModifyByAdmin";
    }
}
