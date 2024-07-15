package com.backend.mapper.member;

import com.backend.domain.member.Member;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MemberMapper {
    @Insert("""
            INSERT INTO member(email, password, name, gender, tel, address, birth)
            VALUES (#{email}, #{password}, #{name}, #{gender}, #{tel}, #{address}, #{birth})
            """)
    int insertMember(Member member);
}
