<?php
	require 'config.php';

	$_birthday = $_POST['year'].'-'.$_POST['month'].'-'.$_POST['date'];

	$query = "INSERT INTO blog_user (user, pass, ques, answer, email, birthday, ps)
												VALUES ('{$_POST['user']}', sha1('{$_POST['pass']}'), '{$_POST['ques']}', '{$_POST['answer']}', '{$_POST['email']}', '{$_birthday}', '{$_POST['ps']}')";

	mysql_query($query) or die('新增失败！'.mysql_error());

	echo mysql_affected_rows();

	mysql_close();
?>
