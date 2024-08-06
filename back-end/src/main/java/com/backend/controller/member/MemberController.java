package com.backend.controller.member;

import com.backend.domain.member.Member;
import com.backend.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/member")
public class MemberController {
    private final MemberService service;

    @PostMapping("signup")
    public ResponseEntity signup(@RequestBody Member member) {
        if (service.validate(member)) {
            service.add(member);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("check")
    public boolean check(@RequestParam String email) {
        return service.checkEmail(email);
    }

    @PostMapping("login")
    public ResponseEntity login(@RequestBody Member member) {
        Map<String, Object> token = service.getToken(member);

        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok(token);
    }

    @GetMapping("list")
    @PreAuthorize("hasAnyAuthority('SCOPE_admin', 'SCOPE_manager', 'SCOPE_admin manager')")
    public List<Member> list() {
        return service.list();
    }

    @GetMapping("{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity get(@PathVariable Integer id, Authentication auth) {
        if (!service.hasAccess(id, auth)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Member member = service.get(id);
        if (member == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(member);
    }

    @PostMapping("passwordCheck")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity passwordCheck(@RequestBody Member member, Authentication auth) {
        if (service.passwordCheck(member, auth)) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @PutMapping("edit")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity edit(@RequestBody Member member, Authentication auth) {
        if (service.hasAccess(member, auth)) {
            Map<String, Object> result = service.edit(member, auth);
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @DeleteMapping("delete")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity delete(@RequestBody Member member, Authentication auth) {
        if (service.hasAccess(member, auth) && service.passwordCheck(member, auth)) {
            service.deleteMember(member.getId());
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @GetMapping("authority")
    public ResponseEntity getAuthority(Authentication auth) {
        if (auth != null && service.isAdminManager(auth)) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
