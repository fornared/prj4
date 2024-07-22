package com.backend.service.member;

import com.backend.domain.member.Member;
import com.backend.mapper.member.MemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    public Map<String, Object> getToken(Member member) {
        Map<String, Object> result = null;

        Member dbMember = mapper.selectByEmail(member.getEmail());

        if (dbMember != null) {
            if (passwordEncoder.matches(member.getPassword(), dbMember.getPassword())) {
                result = new HashMap<>();
                String token = "";
                Instant now = Instant.now();

                List<String> authority = mapper.selectAuthorityByMemberId(dbMember.getId());

                // String authorityString= authority.stream().collect(Collectors.joining(" "));
                String authorityString = String.join(" ", authority);

                JwtClaimsSet claims = JwtClaimsSet.builder()
                        .issuer("self")
                        .issuedAt(now)
                        .expiresAt(now.plusSeconds(60 * 60 * 12))
                        .subject(dbMember.getId().toString())
                        .claim("scope", authorityString)
                        .claim("name", dbMember.getName())
                        .build();


                token = jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();

                result.put("token", token);
            }
        }

        return result;
    }

    public List<Member> list() {
        return mapper.selectAllMember();
    }

    public boolean hasAccess(Integer id, Authentication auth) {
        boolean self = auth.getName().equals(id.toString());

        boolean isAdminManager = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("SCOPE_admin") || a.getAuthority().equals("SCOPE_manager"));

        return self || isAdminManager;
    }

    public boolean hasAccess(Member member, Authentication auth) {
        if (mapper.selectById(member.getId()) == null) {
            return false;
        }

        return hasAccess(member.getId(), auth);
    }

    public Member get(Integer id) {
        return mapper.selectById(id);
    }

    public Map<String, Object> edit(Member member, Authentication auth) {
        if (member.getPassword() != null && !member.getPassword().isEmpty()) {
            member.setPassword(passwordEncoder.encode(member.getPassword()));
        } else {
            member.setPassword(mapper.selectPasswordById(member.getId()));
        }
        mapper.updateMember(member);


        String token = "";

        Jwt jwt = (Jwt) auth.getPrincipal();
        Map<String, Object> claims = jwt.getClaims();
        JwtClaimsSet.Builder jwtClaimsSetBuilder = JwtClaimsSet.builder();
        claims.forEach(jwtClaimsSetBuilder::claim);

        JwtClaimsSet jwtClaimsSet = jwtClaimsSetBuilder.build();
        token = jwtEncoder.encode(JwtEncoderParameters.from(jwtClaimsSet)).getTokenValue();
        return Map.of("token", token);
    }

    public boolean passwordCheck(Member member, Authentication auth) {
        return passwordEncoder.matches(member.getPassword(), mapper.selectPasswordById(Integer.valueOf(auth.getName())));
    }

    public void deleteMember(Integer id) {
        mapper.deleteMember(id);
    }
}
