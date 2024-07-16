package com.backend.mapper.member;

import com.backend.domain.member.Member;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface MemberMapper {
    @Insert("""
            INSERT INTO member(email, password, name, gender, tel, address, birth)
            VALUES (#{email}, #{password}, #{name}, #{gender}, #{tel}, #{address}, #{birth})
            """)
    int insertMember(Member member);

    @Select("""
            SELECT *
            FROM member
            WHERE email=#{email}
            """)
    Member selectByEmail(String email);

    @Select("""
            SELECT name
            FROM member_authority
            WHERE member_id=#{memberId}
            """)
    List<String> selectAuthorityByMemberId(Integer memberId);
}
