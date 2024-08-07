package com.backend.mapper.member;

import com.backend.domain.member.Member;
import org.apache.ibatis.annotations.*;

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

    @Select("""
            SELECT id, email, name, birth, inserted
            FROM member
            ORDER BY id DESC
            """)
    List<Member> selectAllMember();

    @Select("""
            SELECT id, email, name, tel, address, gender, birth, inserted
            FROM member
            WHERE id=#{id}
            """)
    Member selectById(Integer id);

    @Update("""
            UPDATE member
            SET password=#{password}, tel=#{tel}, address=#{address}
            WHERE id=#{id}
            """)
    int updateMember(Member member);

    @Select("""
            SELECT password
            FROM member
            WHERE id=#{id}
            """)
    String selectPasswordById(Integer id);

    @Delete("""
            DELETE FROM member
            WHERE id=#{id}
            """)
    int deleteMember(Integer id);
}
