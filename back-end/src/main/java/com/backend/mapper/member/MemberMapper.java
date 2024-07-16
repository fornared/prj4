package com.backend.mapper.member;

import com.backend.domain.member.Member;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface MemberMapper {
    @Insert("""
            INSERT INTO member(email, password, name, gender, tel, address, birth)
            VALUES (#{email}, #{password}, #{name}, #{gender}, #{tel}, #{address}, #{birth})
            """)
    int insertMember(Member member);

    @Select("""
            SELECT id
            FROM member
            WHERE email=#{email}
            """)
    Integer selectByEmail(String email);
}
