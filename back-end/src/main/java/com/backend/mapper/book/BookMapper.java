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
}
