package com.backend.mapper.book;

import com.backend.domain.book.Book;
import com.backend.domain.book.Kdc;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface BookMapper {
    @Insert("""
            INSERT INTO book(kdc_id, isbn, title, author, publisher, publication_year, description)
            VALUES (#{kdcId}, #{isbn}, #{title}, #{author}, #{publisher}, #{publicationYear}, #{description})
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
            FROM book b LEFT JOIN book_image1 bi ON b.id = bi.book_id
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

    @Select("""
            SELECT b.*, km.name kdcMain, ks.name kdcSub
            FROM book b
                JOIN kdc_sub ks ON b.kdc_id = ks.id
                JOIN kdc_main km ON ks.kdc_main_id = km.id
            WHERE b.id=#{id}
            """)
    Book selectById(Integer id);

    @Select("""
            SELECT name
            FROM book_image1
            WHERE book_id=#{bookId}
            """)
    String selectImageNameByBookId(Integer bookId);

    @Insert("""
            INSERT INTO book_transactions (book_id, member_id, changes)
            VALUES (#{bookId}, #{memberId}, #{changes})
            """)
    int insertBookTransactions(Integer bookId, Integer memberId, Integer changes);

    @Update("""
            UPDATE book_image1
            SET name=#{fileName}
            WHERE book_id=#{bookId}
            """)
    int updateImage(Integer bookId, String fileName);

    @Update("""
            UPDATE book
            SET kdc_id=#{kdcId}, title=#{title}, author=#{author}, publisher=#{publisher}, publication_year=#{publicationYear}, description=#{description}
            WHERE id=#{id}
            """)
    int updateBook(Book book);

    @Delete("""
            DELETE FROM book_image1
            WHERE book_id=#{bookId}
            """)
    int deleteImageByBookId(Integer bookId);

    @Delete("""
            DELETE FROM book_transactions
            WHERE book_id=#{bookId}
            """)
    int deleteBookTransactionsByBookId(Integer bookId);

    @Delete("""
            DELETE FROM book
            WHERE id=#{id}
            """)
    int deleteBookById(Integer id);
}
