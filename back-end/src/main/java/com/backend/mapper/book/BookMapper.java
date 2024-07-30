package com.backend.mapper.book;

import com.backend.domain.book.Book;
import com.backend.domain.book.Kdc;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface BookMapper {
    @Insert("""
            INSERT INTO book(kdc_id, isbn, title, author, publisher, publication_year, description, member_id)
            VALUES (#{kdcId}, #{isbn}, #{title}, #{author}, #{publisher}, #{publicationYear}, #{description}, #{memberId})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertBook(Book book);

    @Select("""
            SELECT *
            FROM kdc_main
            """)
    List<Kdc> selectKdcMain();

    @Select("""
            SELECT *
            FROM kdc_sub
            """)
    List<Kdc> selectKdcSub();

    @Insert("""
            INSERT INTO book_image1(book_id, name)
            VALUES (#{bookId}, #{fileName})
            """)
    int insertImage(Integer bookId, String fileName);

    @Select("""
            SELECT *
            FROM book
            WHERE isbn=#{isbn}
            """)
    Book selectByIsbn(String isbn);

    @Select("""
            <script>
            SELECT COUNT(*)
            FROM book
                <where>
                    <if test="kdc != null">
                        kdc_id = #{kdc}
                        <if test="keyword != null">
                            AND
                        </if>
                    </if>
                    <if test="keyword != null">
                        <bind name="pattern" value="'%' + keyword + '%'" />
                        <trim prefix="(" suffix=")" prefixOverrides="OR">
                            <if test="type == null or type.equals('title')">
                                OR title LIKE #{pattern}
                            </if>
                            <if test="type == null or type.equals('author')">
                                OR author LIKE #{pattern}
                            </if>
                            <if test="type == null or type.equals('publisher')">
                                OR publisher LIKE #{pattern}
                            </if>
                            <if test="type == null or type.equals('isbn')">
                                OR isbn LIKE #{pattern}
                            </if>
                        </trim>
                    </if>
                </where>
            </script>
            """)
    Integer countAllWithSearch(Integer kdc, String type, String keyword);

    @Select("""
            <script>
            SELECT b.*, bi.*
            FROM book b JOIN book_image1 bi ON b.id = bi.book_id
                <where>
                    <if test="kdc != null">
                        kdc_id = #{kdc}
                        <if test="keyword != null">
                            AND
                        </if>
                    </if>
                    <if test="keyword != null">
                        <bind name="pattern" value="'%' + keyword + '%'" />
                        <trim prefix="(" suffix=")" prefixOverrides="OR">
                            <if test="type == null or type.equals('title')">
                                OR title LIKE #{pattern}
                            </if>
                            <if test="type == null or type.equals('author')">
                                OR author LIKE #{pattern}
                            </if>
                            <if test="type == null or type.equals('publisher')">
                                OR publisher LIKE #{pattern}
                            </if>
                            <if test="type == null or type.equals('isbn')">
                                OR isbn LIKE #{pattern}
                            </if>
                        </trim>
                    </if>
                </where>
            ORDER BY b.id DESC
            LIMIT #{offset}, 10
            </script>
            """)
    List<Book> selectAllPaging(Integer offset, Integer kdc, String type, String keyword);
}
