package com.backend.mapper.book;

import com.backend.domain.book.Book;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface BookMapper {
    @Insert("""
            INSERT INTO book(category_id, title, author, publisher, publication_year, isbn, description)
            VALUES (#{categoryId}, #{title}, #{author}, #{publisher}, #{publicationYear}, #{isbn}, #{description})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertBook(Book book);

    @Select("""
            SELECT id
            FROM category
            WHERE name=#{name}
            """)
    Integer selectCategoryIdByName(String name);
}
