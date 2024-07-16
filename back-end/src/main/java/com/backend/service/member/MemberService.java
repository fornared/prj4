package com.backend.service.member;

import com.backend.domain.member.Member;
import com.backend.mapper.member.MemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class MemberService {
    private final MemberMapper mapper;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtEncoder jwtEncoder;

    public void add(Member member) {
        member.setPassword(passwordEncoder.encode(member.getPassword()));

        mapper.insertMember(member);
    }

    public boolean validate(Member member) {
        if (member.getEmail() == null
                || member.getPassword() == null
                || member.getName() == null
                || member.getTel() == null
                || member.getAddress() == null
                || member.getGender() == null
                || member.getBirth() == null) {
            return false;
        }
        if (member.getEmail().isEmpty()
                || member.getPassword().isEmpty()
                || member.getName().isEmpty()
                || member.getTel().isEmpty()
                || member.getAddress().isEmpty()) {
            return false;
        }

        String emailPattern = "[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*";

        if (!member.getEmail().trim().matches(emailPattern)) {
            return false;
        }

        return true;
    }

    public boolean checkEmail(String email) {
        if (mapper.selectByEmail(email.trim()) == null) {
            return true;
        } else {
            return false;
        }
    }
}
